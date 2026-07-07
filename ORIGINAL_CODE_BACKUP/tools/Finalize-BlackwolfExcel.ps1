# BLACKWOLF POWERSHELL TEACHING COMMENTS: ไฟล์นี้เป็นตัวช่วย optional เปิด Excel จริงเพื่อ refresh/verify pivot หลังได้ xlsx จาก web
# ใช้ # เป็น comment ของ PowerShell; ไม่ใช้ // เพราะจะทำให้ script ผิด syntax
[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [string]$InputPath,

    [int]$TimeoutMinutes = 15
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# อธิบาย: สร้าง Exception ที่มี Error Code มาตรฐาน
function New-BwError {
    param([string]$Code, [string]$Message, [System.Exception]$Inner)
    $full = "[$Code] $Message"
    if ($Inner) { $full += "`r`n$($Inner.Message)" }
    return [System.Exception]::new($full, $Inner)
}

# อธิบาย: คืน COM object ของ Excel เพื่อลด Excel.exe ค้างใน Task Manager
function Release-ComObject {
    param($Object)
    if ($null -ne $Object -and [System.Runtime.InteropServices.Marshal]::IsComObject($Object)) {
        try { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($Object) } catch {}
    }
}

# อธิบาย: เปิด dialog ให้ผู้ใช้เลือกไฟล์ Master xlsx
function Select-XlsxFile {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = 'เลือกไฟล์ Master ที่ BLACKWOLF สร้าง'
    $dialog.Filter = 'Excel Workbook (*.xlsx)|*.xlsx'
    $dialog.Multiselect = $false
    if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { return $null }
    return $dialog.FileName
}

# อธิบาย: ตรวจว่าเครื่องมี Microsoft Excel แบบ COM automation หรือไม่
function Test-ExcelInstalled {
    try {
        $type = [type]::GetTypeFromProgID('Excel.Application')
        return $null -ne $type
    } catch { return $false }
}

# อธิบาย: อ่านสถานะ connection refresh ของ workbook
function Get-RefreshState {
    param($Workbook)
    $refreshing = $false
    $connections = @()
    try {
        foreach ($connection in @($Workbook.Connections)) {
            try {
                $name = [string]$connection.Name
                $isRefreshing = $false
                try { $isRefreshing = [bool]$connection.OLEDBConnection.Refreshing } catch {}
                try { if (-not $isRefreshing) { $isRefreshing = [bool]$connection.ODBCConnection.Refreshing } } catch {}
                $connections += [pscustomobject]@{ Name = $name; Refreshing = $isRefreshing }
                if ($isRefreshing) { $refreshing = $true }
            } finally { Release-ComObject $connection }
        }
    } catch {}
    return [pscustomobject]@{ Refreshing = $refreshing; Connections = $connections }
}

# อธิบาย: รอ Excel คำนวณ/refresh ให้เสร็จ หรือ throw เมื่อ timeout
function Wait-ForExcelReady {
    param($Excel, $Workbook, [datetime]$Deadline, [string]$Stage)
    do {
        Start-Sleep -Milliseconds 500
        try { $Excel.CalculateUntilAsyncQueriesDone() } catch {}
        $calculationDone = $false
        try { $calculationDone = ([int]$Excel.CalculationState -eq 0) } catch { $calculationDone = $true }
        $refresh = Get-RefreshState -Workbook $Workbook
        if ($calculationDone -and -not $refresh.Refreshing) { return }
        if ((Get-Date) -gt $Deadline) {
            throw (New-BwError 'BW-FINALIZER-004' "หมดเวลารอ Excel Refresh ที่ขั้นตอน $Stage หลัง $TimeoutMinutes นาที" $null)
        }
    } while ($true)
}

# อธิบาย: หา worksheet ตามชื่อ
function Get-WorksheetByName {
    param($Workbook, [string]$Name)
    foreach ($sheet in @($Workbook.Worksheets)) {
        try {
            if ([string]$sheet.Name -eq $Name) { return $sheet }
        } catch {}
        Release-ComObject $sheet
    }
    return $null
}

# อธิบาย: จัดการขั้นตอนย่อย Set-AuditValue ใน Excel finalizer
function Set-AuditValue {
    param($Sheet, [string]$Key, $Value)
    $used = $Sheet.UsedRange
    try {
        $lastRow = [Math]::Max(1, [int]$used.Rows.Count)
        $targetRow = 0
        for ($row = 1; $row -le $lastRow; $row++) {
            $cell = $Sheet.Cells.Item($row, 1)
            try {
                if ([string]$cell.Text -eq $Key) { $targetRow = $row; break }
            } finally { Release-ComObject $cell }
        }
        if ($targetRow -eq 0) { $targetRow = $lastRow + 1; $Sheet.Cells.Item($targetRow, 1).Value2 = $Key }
        $Sheet.Cells.Item($targetRow, 2).Value2 = [string]$Value
    } finally { Release-ComObject $used }
}

# อธิบาย: จัดการขั้นตอนย่อย Get-PivotCount ใน Excel finalizer
function Get-PivotCount {
    param($Sheet)
    $count = 0
    try { $count = [int]$Sheet.PivotTables().Count } catch {}
    return $count
}

# อธิบาย: จัดการขั้นตอนย่อย Normalize-BwPivotText ใน Excel finalizer
function Normalize-BwPivotText {
    param($Value)
    if ($null -eq $Value) { return '' }
    return (([string]$Value).Trim() -replace '\s+', ' ').ToLowerInvariant()
}

# อธิบาย: จัดการขั้นตอนย่อย Get-PivotFieldByName ใน Excel finalizer
function Get-PivotFieldByName {
    param($Pivot, [string]$FieldName)
    $fields = $null
    try {
        $fields = $Pivot.PivotFields()
        try { return $fields.Item($FieldName) } catch {}
        for ($index = 1; $index -le [int]$fields.Count; $index++) {
            $field = $fields.Item($index)
            try {
                if ((Normalize-BwPivotText $field.Name) -eq (Normalize-BwPivotText $FieldName)) {
                    return $field
                }
            } catch {}
            Release-ComObject $field
        }
        return $null
    } finally {
        Release-ComObject $fields
    }
}

# อธิบาย: จัดการขั้นตอนย่อย Find-PivotItemName ใน Excel finalizer
function Find-PivotItemName {
    param($Field, [string]$TargetValue)
    $items = $null
    try {
        $items = $Field.PivotItems()
        for ($index = 1; $index -le [int]$items.Count; $index++) {
            $item = $items.Item($index)
            try {
                $name = [string]$item.Name
                if ((Normalize-BwPivotText $name) -eq (Normalize-BwPivotText $TargetValue)) {
                    return $name
                }
            } finally { Release-ComObject $item }
        }
        return $null
    } finally {
        Release-ComObject $items
    }
}

# อธิบาย: จัดการขั้นตอนย่อย Get-CurrentPivotPageName ใน Excel finalizer
function Get-CurrentPivotPageName {
    param($Field)
    $current = $null
    try {
        $current = $Field.CurrentPage
        try { return [string]$current.Name } catch { return [string]$current }
    } finally {
        Release-ComObject $current
    }
}

# อธิบาย: จัดการขั้นตอนย่อย Set-StrictReportPivotFilter ใน Excel finalizer
function Set-StrictReportPivotFilter {
    param($Pivot, [string]$FieldName, [string]$TargetValue)
    $field = $null
    try {
        $field = Get-PivotFieldByName -Pivot $Pivot -FieldName $FieldName
        if ($null -eq $field) {
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) ไม่พบ Filter Field: $FieldName" $null)
        }

        $matchedValue = Find-PivotItemName -Field $field -TargetValue $TargetValue
        if (-not $matchedValue) {
            return $null
        }

        try { $field.ClearAllFilters() } catch {}
        try { $field.EnableMultiplePageItems = $false } catch {}
        $field.CurrentPage = $matchedValue

        if (-not [bool]$Pivot.RefreshTable()) {
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Refresh หลังตั้ง Filter ไม่สำเร็จ" $null)
        }

        $actualValue = Get-CurrentPivotPageName -Field $field
        if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $matchedValue)) {
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Filter ไม่ตรง: ต้องเป็น '$matchedValue' แต่พบ '$actualValue'" $null)
        }
        return "$($Pivot.Name)=$matchedValue"
    } finally {
        Release-ComObject $field
    }
}

# อธิบาย: จัดการขั้นตอนย่อย Confirm-StrictReportPivotFilters ใน Excel finalizer
function Confirm-StrictReportPivotFilters {
    param($Sheet, [hashtable]$FilterMap, [int]$ExpectedCount)
    $verified = 0
    $pivotTables = $null
    try {
        $pivotTables = $Sheet.PivotTables()
        for ($index = 1; $index -le [int]$pivotTables.Count; $index++) {
            $pivot = $pivotTables.Item($index)
            $field = $null
            try {
                $pivotName = [string]$pivot.Name
                if (-not $FilterMap.ContainsKey($pivotName)) { continue }
                $field = Get-PivotFieldByName -Pivot $pivot -FieldName 'สถานะไม่ issue'
                if ($null -eq $field) {
                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ไม่พบ Filter Field" $null)
                }
                $actualValue = Get-CurrentPivotPageName -Field $field
                $expectedValue = [string]$FilterMap[$pivotName]
                if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $expectedValue)) {
                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ต้องเป็น '$expectedValue' แต่พบ '$actualValue'" $null)
                }
                $verified++
            } finally {
                Release-ComObject $field
                Release-ComObject $pivot
            }
        }
    } finally {
        Release-ComObject $pivotTables
    }
    if ($verified -ne $ExpectedCount) {
        throw (New-BwError 'BW-FINALIZER-011' "จำนวน Filter ที่ตรวจหลัง Save ไม่ตรง: คาด $ExpectedCount แต่พบ $verified" $null)
    }
    return $verified
}

$excel = $null
$workbook = $null
$verifyBook = $null
$logPath = $null
$sourcePath = $null
$outputPath = $null
$sheets = @{}
$audit = $null
$startedAt = Get-Date
$reportFiltersApplied = 0
$reportFilterResults = @()
$appliedReportFilterMap = @{}
$reportFilterMap = @{
    'PivotTable14' = 'รอ Issue'
    'PivotTable5'  = 'ติดปัญหาไม่เข้าในเมนู E'
    'PivotTable3'  = 'ข้อมูลไม่สมบูรณ์'
    'PivotTable1'  = 'Blacklist'
}

try {
    if (-not $InputPath) { $InputPath = Select-XlsxFile }
    if (-not $InputPath) { Write-Host 'ยกเลิกการเลือกไฟล์'; exit 2 }

    $sourcePath = [System.IO.Path]::GetFullPath($InputPath.Trim('"'))
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw (New-BwError 'BW-FINALIZER-001' "ไม่พบไฟล์: $sourcePath" $null)
    }
    if ([System.IO.Path]::GetExtension($sourcePath).ToLowerInvariant() -ne '.xlsx') {
        throw (New-BwError 'BW-FINALIZER-002' 'Finalizer รองรับเฉพาะไฟล์ .xlsx' $null)
    }
    if (-not (Test-ExcelInstalled)) {
        throw (New-BwError 'BW-FINALIZER-003' 'ไม่พบ Microsoft Excel Desktop ในเครื่อง' $null)
    }

    $folder = [System.IO.Path]::GetDirectoryName($sourcePath)
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($sourcePath)
    if ($baseName.EndsWith('_FINAL', [System.StringComparison]::OrdinalIgnoreCase)) {
        $baseName = $baseName.Substring(0, $baseName.Length - 6)
    }
    $outputPath = Join-Path $folder ($baseName + '_FINAL.xlsx')
    $logPath = Join-Path $folder ($baseName + '_FINALIZER_LOG.txt')

    if (Test-Path -LiteralPath $outputPath) {
        $backup = Join-Path $folder ($baseName + '_FINAL_BACKUP_' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.xlsx')
        Move-Item -LiteralPath $outputPath -Destination $backup -Force
    }
    Copy-Item -LiteralPath $sourcePath -Destination $outputPath -Force

    "BLACKWOLF V3.5.8 Excel Finalizer`r`nStarted: $($startedAt.ToString('s'))`r`nSource: $sourcePath`r`nOutput: $outputPath" | Set-Content -LiteralPath $logPath -Encoding UTF8

    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $excel.EnableEvents = $false
    $excel.AskToUpdateLinks = $false
    try { $excel.AutomationSecurity = 3 } catch {}

    $workbook = $excel.Workbooks.Open($outputPath, 0, $false)
    $requiredSheets = @('Data', 'PV', 'PV Final', 'Report')
    $sheets = @{}
    foreach ($name in $requiredSheets) {
        $sheet = Get-WorksheetByName -Workbook $workbook -Name $name
        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-005' "ไม่พบ Sheet ที่จำเป็น: $name" $null) }
        $sheets[$name] = $sheet
    }

    $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] RefreshAll started"
    $workbook.RefreshAll()
    try { $excel.CalculateFullRebuild() } catch { $excel.CalculateFull() }
    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Refresh All'

    $cacheCount = 0
    try {
        $caches = $workbook.PivotCaches()
        try {
            $cacheCount = [int]$caches.Count
            for ($index = 1; $index -le $cacheCount; $index++) {
                $cache = $caches.Item($index)
                try { $cache.Refresh() } finally { Release-ComObject $cache }
            }
        } finally { Release-ComObject $caches }
    } catch {
        throw (New-BwError 'BW-FINALIZER-006' 'Refresh Pivot Cache ไม่สำเร็จ' $_.Exception)
    }

    $pivotCounts = @{}
    foreach ($name in @('PV', 'Report')) {
        $sheet = $sheets[$name]
        $count = Get-PivotCount -Sheet $sheet
        $pivotCounts[$name] = $count
        if ($count -lt 1) { throw (New-BwError 'BW-FINALIZER-007' "Sheet $name ไม่มี PivotTable" $null) }
        $pivotTables = $sheet.PivotTables()
        try {
            for ($index = 1; $index -le $count; $index++) {
                $pivot = $pivotTables.Item($index)
                try {
                    try { $pivot.EnableDrilldown = $true } catch {}
                    $handledReportFilter = $false
                    if ($name -eq 'Report') {
                        $pivotName = [string]$pivot.Name
                        if ($reportFilterMap.ContainsKey($pivotName)) {
                            $handledReportFilter = $true
                            $targetStatus = [string]$reportFilterMap[$pivotName]
                            $result = Set-StrictReportPivotFilter -Pivot $pivot -FieldName 'สถานะไม่ issue' -TargetValue $targetStatus
                            if ($result) {
                                $reportFilterResults += $result
                                $appliedReportFilterMap[$pivotName] = $targetStatus
                                $reportFiltersApplied++
                            } else {
                                $reportFilterResults += "$pivotName=NO_DATA"
                            }
                        }
                    }
                    if (-not $handledReportFilter) {
                        if (-not [bool]$pivot.RefreshTable()) {
                            throw (New-BwError 'BW-FINALIZER-008' "Refresh PivotTable $name #$index ไม่สำเร็จ" $null)
                        }
                    }
                } finally { Release-ComObject $pivot }
            }
        } finally { Release-ComObject $pivotTables }
    }

    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Pivot refresh'

    $pvFinalTables = 0
    try { $pvFinalTables = [int]$sheets['PV Final'].ListObjects.Count } catch {}
    if ($pvFinalTables -lt 1) { throw (New-BwError 'BW-FINALIZER-009' 'PV Final ไม่มี Excel Table' $null) }

    $audit = Get-WorksheetByName -Workbook $workbook -Name '_Audit'
    if ($null -eq $audit) {
        $audit = $workbook.Worksheets.Add()
        $audit.Name = '_Audit'
        $audit.Cells.Item(1,1).Value2 = 'Key'
        $audit.Cells.Item(1,2).Value2 = 'Value'
    }
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerStatus' -Value 'PASSED'
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerVersion' -Value '3.5.8'
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizedAt' -Value ((Get-Date).ToString('o'))
    Set-AuditValue -Sheet $audit -Key 'PVWorkbookMode' -Value 'FINALIZED_BY_MICROSOFT_EXCEL'
    Set-AuditValue -Sheet $audit -Key 'PivotCacheCountAfterRefresh' -Value $cacheCount
    Set-AuditValue -Sheet $audit -Key 'PVPivotCountAfterRefresh' -Value $pivotCounts['PV']
    Set-AuditValue -Sheet $audit -Key 'ReportPivotCountAfterRefresh' -Value $pivotCounts['Report']
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFiltersApplied' -Value $reportFiltersApplied
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterErrors' -Value 0
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterMap' -Value ($reportFilterResults -join '; ')
    Set-AuditValue -Sheet $audit -Key 'ReportNoDataPivots' -Value (($reportFilterResults | Where-Object { $_ -like '*=NO_DATA' }) -join '; ')
    Set-AuditValue -Sheet $audit -Key 'PVFinalTableCount' -Value $pvFinalTables
    $audit.Visible = 0

    $workbook.Save()
    $workbook.Close($true)
    Release-ComObject $workbook
    $workbook = $null

    $verifyBook = $excel.Workbooks.Open($outputPath, 0, $true)
    foreach ($name in $requiredSheets) {
        $sheet = Get-WorksheetByName -Workbook $verifyBook -Name $name
        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-010' "ตรวจซ้ำหลัง Save แล้วไม่พบ Sheet: $name" $null) }
        Release-ComObject $sheet
    }
    $verifyReport = Get-WorksheetByName -Workbook $verifyBook -Name 'Report'
    try {
        $verifiedReportFilters = Confirm-StrictReportPivotFilters -Sheet $verifyReport -FilterMap $appliedReportFilterMap -ExpectedCount $reportFiltersApplied
    } finally { Release-ComObject $verifyReport }
    $verifyBook.Close($false)
    Release-ComObject $verifyBook
    $verifyBook = $null

    $elapsed = [Math]::Round(((Get-Date) - $startedAt).TotalSeconds, 1)
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] PASSED in $elapsed seconds`r`nPivotCaches=$cacheCount; PV=$($pivotCounts['PV']); Report=$($pivotCounts['Report']); ReportFilters=$reportFiltersApplied; VerifiedReportFilters=$verifiedReportFilters; PVFinalTables=$pvFinalTables`r`nFilterMap=$($reportFilterResults -join '; ')"
    Write-Host ''
    Write-Host 'FINALIZER PASSED' -ForegroundColor Green
    Write-Host "ไฟล์พร้อมตรวจขั้นสุดท้าย: $outputPath"
    Write-Host "Log: $logPath"
    exit 0
}
catch {
    $message = $_.Exception.Message
    if ($logPath) { try { Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] FAILED`r`n$message`r`n$($_.ScriptStackTrace)" } catch {} }
    Write-Host ''
    Write-Host 'FINALIZER FAILED' -ForegroundColor Red
    Write-Host $message -ForegroundColor Red
    if ($logPath) { Write-Host "Log: $logPath" }
    exit 1
}
finally {
    foreach ($sheet in @($sheets.Values)) { Release-ComObject $sheet }
    if ($audit) { Release-ComObject $audit }
    if ($verifyBook) { try { $verifyBook.Close($false) } catch {}; Release-ComObject $verifyBook }
    if ($workbook) { try { $workbook.Close($false) } catch {}; Release-ComObject $workbook }
    if ($excel) { try { $excel.Quit() } catch {}; Release-ComObject $excel }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
