# [L0001] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# BLACKWOLF POWERSHELL TEACHING COMMENTS: ไฟล์นี้เป็นตัวช่วย optional เปิด Excel จริงเพื่อ refresh/verify pivot หลังได้ xlsx จาก web
# [L0002] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# ใช้ # เป็น comment ของ PowerShell; ไม่ใช้ // เพราะจะทำให้ script ผิด syntax
# [L0003] ประกาศให้ script รองรับรูปแบบ advanced function/script ของ PowerShell
[CmdletBinding()]
# [L0004] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
param(
# [L0005] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    [Parameter(Position=0)]
# [L0006] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    [string]$InputPath,
# [L0007] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0008] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    [int]$TimeoutMinutes = 15
# [L0009] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
)
# [L0010] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0011] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
Set-StrictMode -Version Latest
# [L0012] กำหนดค่าตัวแปร $ErrorActionPreference สำหรับใช้ในขั้นตอน PowerShell นี้
$ErrorActionPreference = 'Stop'
# [L0013] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0014] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: สร้าง Exception ที่มี Error Code มาตรฐาน
# [L0015] ประกาศฟังก์ชัน New-BwError เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function New-BwError {
# [L0016] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param([string]$Code, [string]$Message, [System.Exception]$Inner)
# [L0017] กำหนดค่าตัวแปร $full สำหรับใช้ในขั้นตอน PowerShell นี้
    $full = "[$Code] $Message"
# [L0018] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($Inner) { $full += "`r`n$($Inner.Message)" }
# [L0019] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return [System.Exception]::new($full, $Inner)
# [L0020] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0021] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0022] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: คืน COM object ของ Excel เพื่อลด Excel.exe ค้างใน Task Manager
# [L0023] ประกาศฟังก์ชัน Release-ComObject เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Release-ComObject {
# [L0024] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Object)
# [L0025] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($null -ne $Object -and [System.Runtime.InteropServices.Marshal]::IsComObject($Object)) {
# [L0026] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($Object) } catch {}
# [L0027] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0028] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0029] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0030] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: เปิด dialog ให้ผู้ใช้เลือกไฟล์ Master xlsx
# [L0031] ประกาศฟังก์ชัน Select-XlsxFile เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Select-XlsxFile {
# [L0032] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Add-Type -AssemblyName System.Windows.Forms
# [L0033] กำหนดค่าตัวแปร $dialog สำหรับใช้ในขั้นตอน PowerShell นี้
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
# [L0034] กำหนดค่าตัวแปร $dialog.Title สำหรับใช้ในขั้นตอน PowerShell นี้
    $dialog.Title = 'เลือกไฟล์ Master ที่ BLACKWOLF สร้าง'
# [L0035] กำหนดค่าตัวแปร $dialog.Filter สำหรับใช้ในขั้นตอน PowerShell นี้
    $dialog.Filter = 'Excel Workbook (*.xlsx)|*.xlsx'
# [L0036] กำหนดค่าตัวแปร $dialog.Multiselect สำหรับใช้ในขั้นตอน PowerShell นี้
    $dialog.Multiselect = $false
# [L0037] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { return $null }
# [L0038] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return $dialog.FileName
# [L0039] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0040] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0041] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: ตรวจว่าเครื่องมี Microsoft Excel แบบ COM automation หรือไม่
# [L0042] ประกาศฟังก์ชัน Test-ExcelInstalled เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Test-ExcelInstalled {
# [L0043] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0044] กำหนดค่าตัวแปร $type สำหรับใช้ในขั้นตอน PowerShell นี้
        $type = [type]::GetTypeFromProgID('Excel.Application')
# [L0045] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
        return $null -ne $type
# [L0046] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
    } catch { return $false }
# [L0047] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0048] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0049] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: อ่านสถานะ connection refresh ของ workbook
# [L0050] ประกาศฟังก์ชัน Get-RefreshState เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Get-RefreshState {
# [L0051] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Workbook)
# [L0052] กำหนดค่าตัวแปร $refreshing สำหรับใช้ในขั้นตอน PowerShell นี้
    $refreshing = $false
# [L0053] กำหนดค่าตัวแปร $connections สำหรับใช้ในขั้นตอน PowerShell นี้
    $connections = @()
# [L0054] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0055] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
        foreach ($connection in @($Workbook.Connections)) {
# [L0056] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
            try {
# [L0057] กำหนดค่าตัวแปร $name สำหรับใช้ในขั้นตอน PowerShell นี้
                $name = [string]$connection.Name
# [L0058] กำหนดค่าตัวแปร $isRefreshing สำหรับใช้ในขั้นตอน PowerShell นี้
                $isRefreshing = $false
# [L0059] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
                try { $isRefreshing = [bool]$connection.OLEDBConnection.Refreshing } catch {}
# [L0060] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
                try { if (-not $isRefreshing) { $isRefreshing = [bool]$connection.ODBCConnection.Refreshing } } catch {}
# [L0061] กำหนดค่าตัวแปร $connections + สำหรับใช้ในขั้นตอน PowerShell นี้
                $connections += [pscustomobject]@{ Name = $name; Refreshing = $isRefreshing }
# [L0062] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ($isRefreshing) { $refreshing = $true }
# [L0063] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
            } finally { Release-ComObject $connection }
# [L0064] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0065] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
    } catch {}
# [L0066] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return [pscustomobject]@{ Refreshing = $refreshing; Connections = $connections }
# [L0067] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0068] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0069] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: รอ Excel คำนวณ/refresh ให้เสร็จ หรือ throw เมื่อ timeout
# [L0070] ประกาศฟังก์ชัน Wait-ForExcelReady เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Wait-ForExcelReady {
# [L0071] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Excel, $Workbook, [datetime]$Deadline, [string]$Stage)
# [L0072] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    do {
# [L0073] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        Start-Sleep -Milliseconds 500
# [L0074] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { $Excel.CalculateUntilAsyncQueriesDone() } catch {}
# [L0075] กำหนดค่าตัวแปร $calculationDone สำหรับใช้ในขั้นตอน PowerShell นี้
        $calculationDone = $false
# [L0076] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { $calculationDone = ([int]$Excel.CalculationState -eq 0) } catch { $calculationDone = $true }
# [L0077] กำหนดค่าตัวแปร $refresh สำหรับใช้ในขั้นตอน PowerShell นี้
        $refresh = Get-RefreshState -Workbook $Workbook
# [L0078] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($calculationDone -and -not $refresh.Refreshing) { return }
# [L0079] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ((Get-Date) -gt $Deadline) {
# [L0080] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
            throw (New-BwError 'BW-FINALIZER-004' "หมดเวลารอ Excel Refresh ที่ขั้นตอน $Stage หลัง $TimeoutMinutes นาที" $null)
# [L0081] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0082] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    } while ($true)
# [L0083] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0084] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0085] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: หา worksheet ตามชื่อ
# [L0086] ประกาศฟังก์ชัน Get-WorksheetByName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Get-WorksheetByName {
# [L0087] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Workbook, [string]$Name)
# [L0088] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
    foreach ($sheet in @($Workbook.Worksheets)) {
# [L0089] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try {
# [L0090] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
            if ([string]$sheet.Name -eq $Name) { return $sheet }
# [L0091] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
        } catch {}
# [L0092] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $sheet
# [L0093] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0094] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return $null
# [L0095] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0096] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0097] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Set-AuditValue ใน Excel finalizer
# [L0098] ประกาศฟังก์ชัน Set-AuditValue เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Set-AuditValue {
# [L0099] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Sheet, [string]$Key, $Value)
# [L0100] กำหนดค่าตัวแปร $used สำหรับใช้ในขั้นตอน PowerShell นี้
    $used = $Sheet.UsedRange
# [L0101] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0102] กำหนดค่าตัวแปร $lastRow สำหรับใช้ในขั้นตอน PowerShell นี้
        $lastRow = [Math]::Max(1, [int]$used.Rows.Count)
# [L0103] กำหนดค่าตัวแปร $targetRow สำหรับใช้ในขั้นตอน PowerShell นี้
        $targetRow = 0
# [L0104] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
        for ($row = 1; $row -le $lastRow; $row++) {
# [L0105] กำหนดค่าตัวแปร $cell สำหรับใช้ในขั้นตอน PowerShell นี้
            $cell = $Sheet.Cells.Item($row, 1)
# [L0106] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
            try {
# [L0107] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ([string]$cell.Text -eq $Key) { $targetRow = $row; break }
# [L0108] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
            } finally { Release-ComObject $cell }
# [L0109] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0110] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($targetRow -eq 0) { $targetRow = $lastRow + 1; $Sheet.Cells.Item($targetRow, 1).Value2 = $Key }
# [L0111] กำหนดค่าตัวแปร $Sheet.Cells.Item($targetRow, 2).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้
        $Sheet.Cells.Item($targetRow, 2).Value2 = [string]$Value
# [L0112] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally { Release-ComObject $used }
# [L0113] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0114] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0115] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Get-PivotCount ใน Excel finalizer
# [L0116] ประกาศฟังก์ชัน Get-PivotCount เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Get-PivotCount {
# [L0117] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Sheet)
# [L0118] กำหนดค่าตัวแปร $count สำหรับใช้ในขั้นตอน PowerShell นี้
    $count = 0
# [L0119] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try { $count = [int]$Sheet.PivotTables().Count } catch {}
# [L0120] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return $count
# [L0121] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0122] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0123] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Normalize-BwPivotText ใน Excel finalizer
# [L0124] ประกาศฟังก์ชัน Normalize-BwPivotText เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Normalize-BwPivotText {
# [L0125] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Value)
# [L0126] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($null -eq $Value) { return '' }
# [L0127] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return (([string]$Value).Trim() -replace '\s+', ' ').ToLowerInvariant()
# [L0128] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0129] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0130] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Get-PivotFieldByName ใน Excel finalizer
# [L0131] ประกาศฟังก์ชัน Get-PivotFieldByName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Get-PivotFieldByName {
# [L0132] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Pivot, [string]$FieldName)
# [L0133] กำหนดค่าตัวแปร $fields สำหรับใช้ในขั้นตอน PowerShell นี้
    $fields = $null
# [L0134] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0135] กำหนดค่าตัวแปร $fields สำหรับใช้ในขั้นตอน PowerShell นี้
        $fields = $Pivot.PivotFields()
# [L0136] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { return $fields.Item($FieldName) } catch {}
# [L0137] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
        for ($index = 1; $index -le [int]$fields.Count; $index++) {
# [L0138] กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้
            $field = $fields.Item($index)
# [L0139] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
            try {
# [L0140] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ((Normalize-BwPivotText $field.Name) -eq (Normalize-BwPivotText $FieldName)) {
# [L0141] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
                    return $field
# [L0142] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                }
# [L0143] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
            } catch {}
# [L0144] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
            Release-ComObject $field
# [L0145] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0146] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
        return $null
# [L0147] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally {
# [L0148] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $fields
# [L0149] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0150] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0151] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0152] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Find-PivotItemName ใน Excel finalizer
# [L0153] ประกาศฟังก์ชัน Find-PivotItemName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Find-PivotItemName {
# [L0154] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Field, [string]$TargetValue)
# [L0155] กำหนดค่าตัวแปร $items สำหรับใช้ในขั้นตอน PowerShell นี้
    $items = $null
# [L0156] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0157] กำหนดค่าตัวแปร $items สำหรับใช้ในขั้นตอน PowerShell นี้
        $items = $Field.PivotItems()
# [L0158] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
        for ($index = 1; $index -le [int]$items.Count; $index++) {
# [L0159] กำหนดค่าตัวแปร $item สำหรับใช้ในขั้นตอน PowerShell นี้
            $item = $items.Item($index)
# [L0160] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
            try {
# [L0161] กำหนดค่าตัวแปร $name สำหรับใช้ในขั้นตอน PowerShell นี้
                $name = [string]$item.Name
# [L0162] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ((Normalize-BwPivotText $name) -eq (Normalize-BwPivotText $TargetValue)) {
# [L0163] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
                    return $name
# [L0164] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                }
# [L0165] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
            } finally { Release-ComObject $item }
# [L0166] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0167] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
        return $null
# [L0168] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally {
# [L0169] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $items
# [L0170] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0171] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0172] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0173] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Get-CurrentPivotPageName ใน Excel finalizer
# [L0174] ประกาศฟังก์ชัน Get-CurrentPivotPageName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Get-CurrentPivotPageName {
# [L0175] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Field)
# [L0176] กำหนดค่าตัวแปร $current สำหรับใช้ในขั้นตอน PowerShell นี้
    $current = $null
# [L0177] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0178] กำหนดค่าตัวแปร $current สำหรับใช้ในขั้นตอน PowerShell นี้
        $current = $Field.CurrentPage
# [L0179] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { return [string]$current.Name } catch { return [string]$current }
# [L0180] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally {
# [L0181] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $current
# [L0182] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0183] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0184] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0185] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Set-StrictReportPivotFilter ใน Excel finalizer
# [L0186] ประกาศฟังก์ชัน Set-StrictReportPivotFilter เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Set-StrictReportPivotFilter {
# [L0187] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Pivot, [string]$FieldName, [string]$TargetValue)
# [L0188] กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้
    $field = $null
# [L0189] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0190] กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้
        $field = Get-PivotFieldByName -Pivot $Pivot -FieldName $FieldName
# [L0191] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($null -eq $field) {
# [L0192] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) ไม่พบ Filter Field: $FieldName" $null)
# [L0193] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0194] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0195] กำหนดค่าตัวแปร $matchedValue สำหรับใช้ในขั้นตอน PowerShell นี้
        $matchedValue = Find-PivotItemName -Field $field -TargetValue $TargetValue
# [L0196] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if (-not $matchedValue) {
# [L0197] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
            return $null
# [L0198] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0199] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0200] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { $field.ClearAllFilters() } catch {}
# [L0201] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try { $field.EnableMultiplePageItems = $false } catch {}
# [L0202] กำหนดค่าตัวแปร $field.CurrentPage สำหรับใช้ในขั้นตอน PowerShell นี้
        $field.CurrentPage = $matchedValue
# [L0203] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0204] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if (-not [bool]$Pivot.RefreshTable()) {
# [L0205] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Refresh หลังตั้ง Filter ไม่สำเร็จ" $null)
# [L0206] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0207] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0208] กำหนดค่าตัวแปร $actualValue สำหรับใช้ในขั้นตอน PowerShell นี้
        $actualValue = Get-CurrentPivotPageName -Field $field
# [L0209] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $matchedValue)) {
# [L0210] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Filter ไม่ตรง: ต้องเป็น '$matchedValue' แต่พบ '$actualValue'" $null)
# [L0211] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0212] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
        return "$($Pivot.Name)=$matchedValue"
# [L0213] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally {
# [L0214] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $field
# [L0215] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0216] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0217] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0218] คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน
# อธิบาย: จัดการขั้นตอนย่อย Confirm-StrictReportPivotFilters ใน Excel finalizer
# [L0219] ประกาศฟังก์ชัน Confirm-StrictReportPivotFilters เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย
function Confirm-StrictReportPivotFilters {
# [L0220] เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file
    param($Sheet, [hashtable]$FilterMap, [int]$ExpectedCount)
# [L0221] กำหนดค่าตัวแปร $verified สำหรับใช้ในขั้นตอน PowerShell นี้
    $verified = 0
# [L0222] กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้
    $pivotTables = $null
# [L0223] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0224] กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้
        $pivotTables = $Sheet.PivotTables()
# [L0225] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
        for ($index = 1; $index -le [int]$pivotTables.Count; $index++) {
# [L0226] กำหนดค่าตัวแปร $pivot สำหรับใช้ในขั้นตอน PowerShell นี้
            $pivot = $pivotTables.Item($index)
# [L0227] กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้
            $field = $null
# [L0228] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
            try {
# [L0229] กำหนดค่าตัวแปร $pivotName สำหรับใช้ในขั้นตอน PowerShell นี้
                $pivotName = [string]$pivot.Name
# [L0230] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if (-not $FilterMap.ContainsKey($pivotName)) { continue }
# [L0231] กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้
                $field = Get-PivotFieldByName -Pivot $pivot -FieldName 'สถานะไม่ issue'
# [L0232] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ($null -eq $field) {
# [L0233] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ไม่พบ Filter Field" $null)
# [L0234] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                }
# [L0235] กำหนดค่าตัวแปร $actualValue สำหรับใช้ในขั้นตอน PowerShell นี้
                $actualValue = Get-CurrentPivotPageName -Field $field
# [L0236] กำหนดค่าตัวแปร $expectedValue สำหรับใช้ในขั้นตอน PowerShell นี้
                $expectedValue = [string]$FilterMap[$pivotName]
# [L0237] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $expectedValue)) {
# [L0238] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ต้องเป็น '$expectedValue' แต่พบ '$actualValue'" $null)
# [L0239] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                }
# [L0240] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                $verified++
# [L0241] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
            } finally {
# [L0242] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
                Release-ComObject $field
# [L0243] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
                Release-ComObject $pivot
# [L0244] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
            }
# [L0245] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        }
# [L0246] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally {
# [L0247] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $pivotTables
# [L0248] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0249] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($verified -ne $ExpectedCount) {
# [L0250] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
        throw (New-BwError 'BW-FINALIZER-011' "จำนวน Filter ที่ตรวจหลัง Save ไม่ตรง: คาด $ExpectedCount แต่พบ $verified" $null)
# [L0251] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0252] คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell
    return $verified
# [L0253] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0254] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0255] กำหนดค่าตัวแปร $excel สำหรับใช้ในขั้นตอน PowerShell นี้
$excel = $null
# [L0256] กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้
$workbook = $null
# [L0257] กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้
$verifyBook = $null
# [L0258] กำหนดค่าตัวแปร $logPath สำหรับใช้ในขั้นตอน PowerShell นี้
$logPath = $null
# [L0259] กำหนดค่าตัวแปร $sourcePath สำหรับใช้ในขั้นตอน PowerShell นี้
$sourcePath = $null
# [L0260] กำหนดค่าตัวแปร $outputPath สำหรับใช้ในขั้นตอน PowerShell นี้
$outputPath = $null
# [L0261] กำหนดค่าตัวแปร $sheets สำหรับใช้ในขั้นตอน PowerShell นี้
$sheets = @{}
# [L0262] กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้
$audit = $null
# [L0263] กำหนดค่าตัวแปร $startedAt สำหรับใช้ในขั้นตอน PowerShell นี้
$startedAt = Get-Date
# [L0264] กำหนดค่าตัวแปร $reportFiltersApplied สำหรับใช้ในขั้นตอน PowerShell นี้
$reportFiltersApplied = 0
# [L0265] กำหนดค่าตัวแปร $reportFilterResults สำหรับใช้ในขั้นตอน PowerShell นี้
$reportFilterResults = @()
# [L0266] กำหนดค่าตัวแปร $appliedReportFilterMap สำหรับใช้ในขั้นตอน PowerShell นี้
$appliedReportFilterMap = @{}
# [L0267] กำหนดค่าตัวแปร $reportFilterMap สำหรับใช้ในขั้นตอน PowerShell นี้
$reportFilterMap = @{
# [L0268] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    'PivotTable14' = 'รอ Issue'
# [L0269] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    'PivotTable5'  = 'ติดปัญหาไม่เข้าในเมนู E'
# [L0270] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    'PivotTable3'  = 'ข้อมูลไม่สมบูรณ์'
# [L0271] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    'PivotTable1'  = 'Blacklist'
# [L0272] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0273] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0274] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
try {
# [L0275] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if (-not $InputPath) { $InputPath = Select-XlsxFile }
# [L0276] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if (-not $InputPath) { Write-Host 'ยกเลิกการเลือกไฟล์'; exit 2 }
# [L0277] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0278] กำหนดค่าตัวแปร $sourcePath สำหรับใช้ในขั้นตอน PowerShell นี้
    $sourcePath = [System.IO.Path]::GetFullPath($InputPath.Trim('"'))
# [L0279] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
# [L0280] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
        throw (New-BwError 'BW-FINALIZER-001' "ไม่พบไฟล์: $sourcePath" $null)
# [L0281] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0282] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ([System.IO.Path]::GetExtension($sourcePath).ToLowerInvariant() -ne '.xlsx') {
# [L0283] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
        throw (New-BwError 'BW-FINALIZER-002' 'Finalizer รองรับเฉพาะไฟล์ .xlsx' $null)
# [L0284] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0285] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if (-not (Test-ExcelInstalled)) {
# [L0286] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
        throw (New-BwError 'BW-FINALIZER-003' 'ไม่พบ Microsoft Excel Desktop ในเครื่อง' $null)
# [L0287] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0288] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0289] กำหนดค่าตัวแปร $folder สำหรับใช้ในขั้นตอน PowerShell นี้
    $folder = [System.IO.Path]::GetDirectoryName($sourcePath)
# [L0290] กำหนดค่าตัวแปร $baseName สำหรับใช้ในขั้นตอน PowerShell นี้
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($sourcePath)
# [L0291] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($baseName.EndsWith('_FINAL', [System.StringComparison]::OrdinalIgnoreCase)) {
# [L0292] กำหนดค่าตัวแปร $baseName สำหรับใช้ในขั้นตอน PowerShell นี้
        $baseName = $baseName.Substring(0, $baseName.Length - 6)
# [L0293] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0294] กำหนดค่าตัวแปร $outputPath สำหรับใช้ในขั้นตอน PowerShell นี้
    $outputPath = Join-Path $folder ($baseName + '_FINAL.xlsx')
# [L0295] กำหนดค่าตัวแปร $logPath สำหรับใช้ในขั้นตอน PowerShell นี้
    $logPath = Join-Path $folder ($baseName + '_FINALIZER_LOG.txt')
# [L0296] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0297] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if (Test-Path -LiteralPath $outputPath) {
# [L0298] กำหนดค่าตัวแปร $backup สำหรับใช้ในขั้นตอน PowerShell นี้
        $backup = Join-Path $folder ($baseName + '_FINAL_BACKUP_' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.xlsx')
# [L0299] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
        Move-Item -LiteralPath $outputPath -Destination $backup -Force
# [L0300] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0301] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Copy-Item -LiteralPath $sourcePath -Destination $outputPath -Force
# [L0302] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0303] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    "BLACKWOLF V3.5.8 Excel Finalizer`r`nStarted: $($startedAt.ToString('s'))`r`nSource: $sourcePath`r`nOutput: $outputPath" | Set-Content -LiteralPath $logPath -Encoding UTF8
# [L0304] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0305] กำหนดค่าตัวแปร $excel สำหรับใช้ในขั้นตอน PowerShell นี้
    $excel = New-Object -ComObject Excel.Application
# [L0306] กำหนดค่าตัวแปร $excel.Visible สำหรับใช้ในขั้นตอน PowerShell นี้
    $excel.Visible = $false
# [L0307] กำหนดค่าตัวแปร $excel.DisplayAlerts สำหรับใช้ในขั้นตอน PowerShell นี้
    $excel.DisplayAlerts = $false
# [L0308] กำหนดค่าตัวแปร $excel.EnableEvents สำหรับใช้ในขั้นตอน PowerShell นี้
    $excel.EnableEvents = $false
# [L0309] กำหนดค่าตัวแปร $excel.AskToUpdateLinks สำหรับใช้ในขั้นตอน PowerShell นี้
    $excel.AskToUpdateLinks = $false
# [L0310] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try { $excel.AutomationSecurity = 3 } catch {}
# [L0311] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0312] กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้
    $workbook = $excel.Workbooks.Open($outputPath, 0, $false)
# [L0313] กำหนดค่าตัวแปร $requiredSheets สำหรับใช้ในขั้นตอน PowerShell นี้
    $requiredSheets = @('Data', 'PV', 'PV Final', 'Report')
# [L0314] กำหนดค่าตัวแปร $sheets สำหรับใช้ในขั้นตอน PowerShell นี้
    $sheets = @{}
# [L0315] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
    foreach ($name in $requiredSheets) {
# [L0316] กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้
        $sheet = Get-WorksheetByName -Workbook $workbook -Name $name
# [L0317] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-005' "ไม่พบ Sheet ที่จำเป็น: $name" $null) }
# [L0318] กำหนดค่าตัวแปร $sheets[$name] สำหรับใช้ในขั้นตอน PowerShell นี้
        $sheets[$name] = $sheet
# [L0319] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0320] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0321] กำหนดค่าตัวแปร $deadline สำหรับใช้ในขั้นตอน PowerShell นี้
    $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
# [L0322] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] RefreshAll started"
# [L0323] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    $workbook.RefreshAll()
# [L0324] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try { $excel.CalculateFullRebuild() } catch { $excel.CalculateFull() }
# [L0325] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Refresh All'
# [L0326] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0327] กำหนดค่าตัวแปร $cacheCount สำหรับใช้ในขั้นตอน PowerShell นี้
    $cacheCount = 0
# [L0328] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0329] กำหนดค่าตัวแปร $caches สำหรับใช้ในขั้นตอน PowerShell นี้
        $caches = $workbook.PivotCaches()
# [L0330] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try {
# [L0331] กำหนดค่าตัวแปร $cacheCount สำหรับใช้ในขั้นตอน PowerShell นี้
            $cacheCount = [int]$caches.Count
# [L0332] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
            for ($index = 1; $index -le $cacheCount; $index++) {
# [L0333] กำหนดค่าตัวแปร $cache สำหรับใช้ในขั้นตอน PowerShell นี้
                $cache = $caches.Item($index)
# [L0334] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
                try { $cache.Refresh() } finally { Release-ComObject $cache }
# [L0335] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
            }
# [L0336] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
        } finally { Release-ComObject $caches }
# [L0337] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
    } catch {
# [L0338] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
        throw (New-BwError 'BW-FINALIZER-006' 'Refresh Pivot Cache ไม่สำเร็จ' $_.Exception)
# [L0339] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0340] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0341] กำหนดค่าตัวแปร $pivotCounts สำหรับใช้ในขั้นตอน PowerShell นี้
    $pivotCounts = @{}
# [L0342] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
    foreach ($name in @('PV', 'Report')) {
# [L0343] กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้
        $sheet = $sheets[$name]
# [L0344] กำหนดค่าตัวแปร $count สำหรับใช้ในขั้นตอน PowerShell นี้
        $count = Get-PivotCount -Sheet $sheet
# [L0345] กำหนดค่าตัวแปร $pivotCounts[$name] สำหรับใช้ในขั้นตอน PowerShell นี้
        $pivotCounts[$name] = $count
# [L0346] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($count -lt 1) { throw (New-BwError 'BW-FINALIZER-007' "Sheet $name ไม่มี PivotTable" $null) }
# [L0347] กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้
        $pivotTables = $sheet.PivotTables()
# [L0348] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
        try {
# [L0349] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
            for ($index = 1; $index -le $count; $index++) {
# [L0350] กำหนดค่าตัวแปร $pivot สำหรับใช้ในขั้นตอน PowerShell นี้
                $pivot = $pivotTables.Item($index)
# [L0351] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
                try {
# [L0352] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
                    try { $pivot.EnableDrilldown = $true } catch {}
# [L0353] กำหนดค่าตัวแปร $handledReportFilter สำหรับใช้ในขั้นตอน PowerShell นี้
                    $handledReportFilter = $false
# [L0354] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                    if ($name -eq 'Report') {
# [L0355] กำหนดค่าตัวแปร $pivotName สำหรับใช้ในขั้นตอน PowerShell นี้
                        $pivotName = [string]$pivot.Name
# [L0356] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                        if ($reportFilterMap.ContainsKey($pivotName)) {
# [L0357] กำหนดค่าตัวแปร $handledReportFilter สำหรับใช้ในขั้นตอน PowerShell นี้
                            $handledReportFilter = $true
# [L0358] กำหนดค่าตัวแปร $targetStatus สำหรับใช้ในขั้นตอน PowerShell นี้
                            $targetStatus = [string]$reportFilterMap[$pivotName]
# [L0359] กำหนดค่าตัวแปร $result สำหรับใช้ในขั้นตอน PowerShell นี้
                            $result = Set-StrictReportPivotFilter -Pivot $pivot -FieldName 'สถานะไม่ issue' -TargetValue $targetStatus
# [L0360] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                            if ($result) {
# [L0361] กำหนดค่าตัวแปร $reportFilterResults + สำหรับใช้ในขั้นตอน PowerShell นี้
                                $reportFilterResults += $result
# [L0362] กำหนดค่าตัวแปร $appliedReportFilterMap[$pivotName] สำหรับใช้ในขั้นตอน PowerShell นี้
                                $appliedReportFilterMap[$pivotName] = $targetStatus
# [L0363] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                                $reportFiltersApplied++
# [L0364] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                            } else {
# [L0365] กำหนดค่าตัวแปร $reportFilterResults + สำหรับใช้ในขั้นตอน PowerShell นี้
                                $reportFilterResults += "$pivotName=NO_DATA"
# [L0366] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                            }
# [L0367] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                        }
# [L0368] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                    }
# [L0369] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                    if (-not $handledReportFilter) {
# [L0370] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
                        if (-not [bool]$pivot.RefreshTable()) {
# [L0371] หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย
                            throw (New-BwError 'BW-FINALIZER-008' "Refresh PivotTable $name #$index ไม่สำเร็จ" $null)
# [L0372] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                        }
# [L0373] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
                    }
# [L0374] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
                } finally { Release-ComObject $pivot }
# [L0375] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
            }
# [L0376] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
        } finally { Release-ComObject $pivotTables }
# [L0377] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0378] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0379] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Pivot refresh'
# [L0380] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0381] กำหนดค่าตัวแปร $pvFinalTables สำหรับใช้ในขั้นตอน PowerShell นี้
    $pvFinalTables = 0
# [L0382] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try { $pvFinalTables = [int]$sheets['PV Final'].ListObjects.Count } catch {}
# [L0383] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($pvFinalTables -lt 1) { throw (New-BwError 'BW-FINALIZER-009' 'PV Final ไม่มี Excel Table' $null) }
# [L0384] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0385] กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้
    $audit = Get-WorksheetByName -Workbook $workbook -Name '_Audit'
# [L0386] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($null -eq $audit) {
# [L0387] กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้
        $audit = $workbook.Worksheets.Add()
# [L0388] กำหนดค่าตัวแปร $audit.Name สำหรับใช้ในขั้นตอน PowerShell นี้
        $audit.Name = '_Audit'
# [L0389] กำหนดค่าตัวแปร $audit.Cells.Item(1,1).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้
        $audit.Cells.Item(1,1).Value2 = 'Key'
# [L0390] กำหนดค่าตัวแปร $audit.Cells.Item(1,2).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้
        $audit.Cells.Item(1,2).Value2 = 'Value'
# [L0391] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0392] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerStatus' -Value 'PASSED'
# [L0393] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerVersion' -Value '3.5.8'
# [L0394] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizedAt' -Value ((Get-Date).ToString('o'))
# [L0395] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'PVWorkbookMode' -Value 'FINALIZED_BY_MICROSOFT_EXCEL'
# [L0396] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'PivotCacheCountAfterRefresh' -Value $cacheCount
# [L0397] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'PVPivotCountAfterRefresh' -Value $pivotCounts['PV']
# [L0398] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ReportPivotCountAfterRefresh' -Value $pivotCounts['Report']
# [L0399] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFiltersApplied' -Value $reportFiltersApplied
# [L0400] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterErrors' -Value 0
# [L0401] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterMap' -Value ($reportFilterResults -join '; ')
# [L0402] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'ReportNoDataPivots' -Value (($reportFilterResults | Where-Object { $_ -like '*=NO_DATA' }) -join '; ')
# [L0403] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Set-AuditValue -Sheet $audit -Key 'PVFinalTableCount' -Value $pvFinalTables
# [L0404] กำหนดค่าตัวแปร $audit.Visible สำหรับใช้ในขั้นตอน PowerShell นี้
    $audit.Visible = 0
# [L0405] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0406] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    $workbook.Save()
# [L0407] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    $workbook.Close($true)
# [L0408] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
    Release-ComObject $workbook
# [L0409] กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้
    $workbook = $null
# [L0410] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0411] กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้
    $verifyBook = $excel.Workbooks.Open($outputPath, 0, $true)
# [L0412] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
    foreach ($name in $requiredSheets) {
# [L0413] กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้
        $sheet = Get-WorksheetByName -Workbook $verifyBook -Name $name
# [L0414] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-010' "ตรวจซ้ำหลัง Save แล้วไม่พบ Sheet: $name" $null) }
# [L0415] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
        Release-ComObject $sheet
# [L0416] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    }
# [L0417] กำหนดค่าตัวแปร $verifyReport สำหรับใช้ในขั้นตอน PowerShell นี้
    $verifyReport = Get-WorksheetByName -Workbook $verifyBook -Name 'Report'
# [L0418] เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้
    try {
# [L0419] กำหนดค่าตัวแปร $verifiedReportFilters สำหรับใช้ในขั้นตอน PowerShell นี้
        $verifiedReportFilters = Confirm-StrictReportPivotFilters -Sheet $verifyReport -FilterMap $appliedReportFilterMap -ExpectedCount $reportFiltersApplied
# [L0420] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
    } finally { Release-ComObject $verifyReport }
# [L0421] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    $verifyBook.Close($false)
# [L0422] คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ
    Release-ComObject $verifyBook
# [L0423] กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้
    $verifyBook = $null
# [L0424] บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย

# [L0425] กำหนดค่าตัวแปร $elapsed สำหรับใช้ในขั้นตอน PowerShell นี้
    $elapsed = [Math]::Round(((Get-Date) - $startedAt).TotalSeconds, 1)
# [L0426] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] PASSED in $elapsed seconds`r`nPivotCaches=$cacheCount; PV=$($pivotCounts['PV']); Report=$($pivotCounts['Report']); ReportFilters=$reportFiltersApplied; VerifiedReportFilters=$verifiedReportFilters; PVFinalTables=$pvFinalTables`r`nFilterMap=$($reportFilterResults -join '; ')"
# [L0427] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host ''
# [L0428] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host 'FINALIZER PASSED' -ForegroundColor Green
# [L0429] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host "ไฟล์พร้อมตรวจขั้นสุดท้าย: $outputPath"
# [L0430] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host "Log: $logPath"
# [L0431] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    exit 0
# [L0432] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0433] จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่
catch {
# [L0434] กำหนดค่าตัวแปร $message สำหรับใช้ในขั้นตอน PowerShell นี้
    $message = $_.Exception.Message
# [L0435] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($logPath) { try { Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] FAILED`r`n$message`r`n$($_.ScriptStackTrace)" } catch {} }
# [L0436] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host ''
# [L0437] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host 'FINALIZER FAILED' -ForegroundColor Red
# [L0438] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    Write-Host $message -ForegroundColor Red
# [L0439] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($logPath) { Write-Host "Log: $logPath" }
# [L0440] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    exit 1
# [L0441] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
# [L0442] คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง
finally {
# [L0443] วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์
    foreach ($sheet in @($sheets.Values)) { Release-ComObject $sheet }
# [L0444] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($audit) { Release-ComObject $audit }
# [L0445] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($verifyBook) { try { $verifyBook.Close($false) } catch {}; Release-ComObject $verifyBook }
# [L0446] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($workbook) { try { $workbook.Close($false) } catch {}; Release-ComObject $workbook }
# [L0447] ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่
    if ($excel) { try { $excel.Quit() } catch {}; Release-ComObject $excel }
# [L0448] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    [GC]::Collect()
# [L0449] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
    [GC]::WaitForPendingFinalizers()
# [L0450] คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ
}
