# อธิบายบรรทัดต่อบรรทัด: `tools/Finalize-BlackwolfExcel.ps1`

**บทบาทไฟล์:** PowerShell Finalizer optional: เปิด Excel จริงเพื่อ refresh/verify pivot หลังเว็บสร้าง xlsx

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `# BLACKWOLF POWERSHELL TEACHING COMMENTS: ไฟล์นี้เป็นตัวช่วย optional เปิด Excel จริงเพื่อ refresh/verify pivot หลังได้ xlsx จาก web` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0002 | `# ใช้ # เป็น comment ของ PowerShell; ไม่ใช้ // เพราะจะทำให้ script ผิด syntax` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0003 | `[CmdletBinding()]` | ประกาศให้ script รองรับรูปแบบ advanced function/script ของ PowerShell |
| L0004 | `param(` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0005 | `    [Parameter(Position=0)]` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0006 | `    [string]$InputPath,` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0007 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0008 | `    [int]$TimeoutMinutes = 15` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0009 | `)` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0010 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0011 | `Set-StrictMode -Version Latest` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0012 | `$ErrorActionPreference = 'Stop'` | กำหนดค่าตัวแปร $ErrorActionPreference สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0013 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0014 | `# อธิบาย: สร้าง Exception ที่มี Error Code มาตรฐาน` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0015 | `function New-BwError {` | ประกาศฟังก์ชัน New-BwError เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0016 | `    param([string]$Code, [string]$Message, [System.Exception]$Inner)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0017 | `    $full = "[$Code] $Message"` | กำหนดค่าตัวแปร $full สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0018 | `    if ($Inner) { $full += "\`r\`n$($Inner.Message)" }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0019 | `    return [System.Exception]::new($full, $Inner)` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0020 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0021 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0022 | `# อธิบาย: คืน COM object ของ Excel เพื่อลด Excel.exe ค้างใน Task Manager` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0023 | `function Release-ComObject {` | ประกาศฟังก์ชัน Release-ComObject เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0024 | `    param($Object)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0025 | `    if ($null -ne $Object -and [System.Runtime.InteropServices.Marshal]::IsComObject($Object)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0026 | `        try { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($Object) } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0027 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0028 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0029 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0030 | `# อธิบาย: เปิด dialog ให้ผู้ใช้เลือกไฟล์ Master xlsx` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0031 | `function Select-XlsxFile {` | ประกาศฟังก์ชัน Select-XlsxFile เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0032 | `    Add-Type -AssemblyName System.Windows.Forms` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0033 | `    $dialog = New-Object System.Windows.Forms.OpenFileDialog` | กำหนดค่าตัวแปร $dialog สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0034 | `    $dialog.Title = 'เลือกไฟล์ Master ที่ BLACKWOLF สร้าง'` | กำหนดค่าตัวแปร $dialog.Title สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0035 | `    $dialog.Filter = 'Excel Workbook (*.xlsx)\|*.xlsx'` | กำหนดค่าตัวแปร $dialog.Filter สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0036 | `    $dialog.Multiselect = $false` | กำหนดค่าตัวแปร $dialog.Multiselect สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0037 | `    if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { return $null }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0038 | `    return $dialog.FileName` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0039 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0040 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0041 | `# อธิบาย: ตรวจว่าเครื่องมี Microsoft Excel แบบ COM automation หรือไม่` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0042 | `function Test-ExcelInstalled {` | ประกาศฟังก์ชัน Test-ExcelInstalled เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0043 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0044 | `        $type = [type]::GetTypeFromProgID('Excel.Application')` | กำหนดค่าตัวแปร $type สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0045 | `        return $null -ne $type` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0046 | `    } catch { return $false }` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0047 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0048 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0049 | `# อธิบาย: อ่านสถานะ connection refresh ของ workbook` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0050 | `function Get-RefreshState {` | ประกาศฟังก์ชัน Get-RefreshState เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0051 | `    param($Workbook)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0052 | `    $refreshing = $false` | กำหนดค่าตัวแปร $refreshing สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0053 | `    $connections = @()` | กำหนดค่าตัวแปร $connections สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0054 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0055 | `        foreach ($connection in @($Workbook.Connections)) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0056 | `            try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0057 | `                $name = [string]$connection.Name` | กำหนดค่าตัวแปร $name สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0058 | `                $isRefreshing = $false` | กำหนดค่าตัวแปร $isRefreshing สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0059 | `                try { $isRefreshing = [bool]$connection.OLEDBConnection.Refreshing } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0060 | `                try { if (-not $isRefreshing) { $isRefreshing = [bool]$connection.ODBCConnection.Refreshing } } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0061 | `                $connections += [pscustomobject]@{ Name = $name; Refreshing = $isRefreshing }` | กำหนดค่าตัวแปร $connections + สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0062 | `                if ($isRefreshing) { $refreshing = $true }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0063 | `            } finally { Release-ComObject $connection }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0064 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0065 | `    } catch {}` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0066 | `    return [pscustomobject]@{ Refreshing = $refreshing; Connections = $connections }` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0067 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0068 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0069 | `# อธิบาย: รอ Excel คำนวณ/refresh ให้เสร็จ หรือ throw เมื่อ timeout` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0070 | `function Wait-ForExcelReady {` | ประกาศฟังก์ชัน Wait-ForExcelReady เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0071 | `    param($Excel, $Workbook, [datetime]$Deadline, [string]$Stage)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0072 | `    do {` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0073 | `        Start-Sleep -Milliseconds 500` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0074 | `        try { $Excel.CalculateUntilAsyncQueriesDone() } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0075 | `        $calculationDone = $false` | กำหนดค่าตัวแปร $calculationDone สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0076 | `        try { $calculationDone = ([int]$Excel.CalculationState -eq 0) } catch { $calculationDone = $true }` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0077 | `        $refresh = Get-RefreshState -Workbook $Workbook` | กำหนดค่าตัวแปร $refresh สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0078 | `        if ($calculationDone -and -not $refresh.Refreshing) { return }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0079 | `        if ((Get-Date) -gt $Deadline) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0080 | `            throw (New-BwError 'BW-FINALIZER-004' "หมดเวลารอ Excel Refresh ที่ขั้นตอน $Stage หลัง $TimeoutMinutes นาที" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0081 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0082 | `    } while ($true)` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0083 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0084 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0085 | `# อธิบาย: หา worksheet ตามชื่อ` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0086 | `function Get-WorksheetByName {` | ประกาศฟังก์ชัน Get-WorksheetByName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0087 | `    param($Workbook, [string]$Name)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0088 | `    foreach ($sheet in @($Workbook.Worksheets)) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0089 | `        try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0090 | `            if ([string]$sheet.Name -eq $Name) { return $sheet }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0091 | `        } catch {}` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0092 | `        Release-ComObject $sheet` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0093 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0094 | `    return $null` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0095 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0096 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0097 | `# อธิบาย: จัดการขั้นตอนย่อย Set-AuditValue ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0098 | `function Set-AuditValue {` | ประกาศฟังก์ชัน Set-AuditValue เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0099 | `    param($Sheet, [string]$Key, $Value)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0100 | `    $used = $Sheet.UsedRange` | กำหนดค่าตัวแปร $used สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0101 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0102 | `        $lastRow = [Math]::Max(1, [int]$used.Rows.Count)` | กำหนดค่าตัวแปร $lastRow สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0103 | `        $targetRow = 0` | กำหนดค่าตัวแปร $targetRow สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0104 | `        for ($row = 1; $row -le $lastRow; $row++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0105 | `            $cell = $Sheet.Cells.Item($row, 1)` | กำหนดค่าตัวแปร $cell สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0106 | `            try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0107 | `                if ([string]$cell.Text -eq $Key) { $targetRow = $row; break }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0108 | `            } finally { Release-ComObject $cell }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0109 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0110 | `        if ($targetRow -eq 0) { $targetRow = $lastRow + 1; $Sheet.Cells.Item($targetRow, 1).Value2 = $Key }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0111 | `        $Sheet.Cells.Item($targetRow, 2).Value2 = [string]$Value` | กำหนดค่าตัวแปร $Sheet.Cells.Item($targetRow, 2).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0112 | `    } finally { Release-ComObject $used }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0113 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0114 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0115 | `# อธิบาย: จัดการขั้นตอนย่อย Get-PivotCount ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0116 | `function Get-PivotCount {` | ประกาศฟังก์ชัน Get-PivotCount เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0117 | `    param($Sheet)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0118 | `    $count = 0` | กำหนดค่าตัวแปร $count สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0119 | `    try { $count = [int]$Sheet.PivotTables().Count } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0120 | `    return $count` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0121 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0122 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0123 | `# อธิบาย: จัดการขั้นตอนย่อย Normalize-BwPivotText ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0124 | `function Normalize-BwPivotText {` | ประกาศฟังก์ชัน Normalize-BwPivotText เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0125 | `    param($Value)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0126 | `    if ($null -eq $Value) { return '' }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0127 | `    return (([string]$Value).Trim() -replace '\s+', ' ').ToLowerInvariant()` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0128 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0129 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0130 | `# อธิบาย: จัดการขั้นตอนย่อย Get-PivotFieldByName ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0131 | `function Get-PivotFieldByName {` | ประกาศฟังก์ชัน Get-PivotFieldByName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0132 | `    param($Pivot, [string]$FieldName)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0133 | `    $fields = $null` | กำหนดค่าตัวแปร $fields สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0134 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0135 | `        $fields = $Pivot.PivotFields()` | กำหนดค่าตัวแปร $fields สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0136 | `        try { return $fields.Item($FieldName) } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0137 | `        for ($index = 1; $index -le [int]$fields.Count; $index++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0138 | `            $field = $fields.Item($index)` | กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0139 | `            try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0140 | `                if ((Normalize-BwPivotText $field.Name) -eq (Normalize-BwPivotText $FieldName)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0141 | `                    return $field` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0142 | `                }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0143 | `            } catch {}` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0144 | `            Release-ComObject $field` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0145 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0146 | `        return $null` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0147 | `    } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0148 | `        Release-ComObject $fields` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0149 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0150 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0151 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0152 | `# อธิบาย: จัดการขั้นตอนย่อย Find-PivotItemName ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0153 | `function Find-PivotItemName {` | ประกาศฟังก์ชัน Find-PivotItemName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0154 | `    param($Field, [string]$TargetValue)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0155 | `    $items = $null` | กำหนดค่าตัวแปร $items สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0156 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0157 | `        $items = $Field.PivotItems()` | กำหนดค่าตัวแปร $items สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0158 | `        for ($index = 1; $index -le [int]$items.Count; $index++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0159 | `            $item = $items.Item($index)` | กำหนดค่าตัวแปร $item สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0160 | `            try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0161 | `                $name = [string]$item.Name` | กำหนดค่าตัวแปร $name สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0162 | `                if ((Normalize-BwPivotText $name) -eq (Normalize-BwPivotText $TargetValue)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0163 | `                    return $name` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0164 | `                }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0165 | `            } finally { Release-ComObject $item }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0166 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0167 | `        return $null` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0168 | `    } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0169 | `        Release-ComObject $items` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0170 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0171 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0172 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0173 | `# อธิบาย: จัดการขั้นตอนย่อย Get-CurrentPivotPageName ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0174 | `function Get-CurrentPivotPageName {` | ประกาศฟังก์ชัน Get-CurrentPivotPageName เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0175 | `    param($Field)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0176 | `    $current = $null` | กำหนดค่าตัวแปร $current สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0177 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0178 | `        $current = $Field.CurrentPage` | กำหนดค่าตัวแปร $current สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0179 | `        try { return [string]$current.Name } catch { return [string]$current }` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0180 | `    } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0181 | `        Release-ComObject $current` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0182 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0183 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0184 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0185 | `# อธิบาย: จัดการขั้นตอนย่อย Set-StrictReportPivotFilter ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0186 | `function Set-StrictReportPivotFilter {` | ประกาศฟังก์ชัน Set-StrictReportPivotFilter เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0187 | `    param($Pivot, [string]$FieldName, [string]$TargetValue)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0188 | `    $field = $null` | กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0189 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0190 | `        $field = Get-PivotFieldByName -Pivot $Pivot -FieldName $FieldName` | กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0191 | `        if ($null -eq $field) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0192 | `            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) ไม่พบ Filter Field: $FieldName" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0193 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0194 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0195 | `        $matchedValue = Find-PivotItemName -Field $field -TargetValue $TargetValue` | กำหนดค่าตัวแปร $matchedValue สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0196 | `        if (-not $matchedValue) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0197 | `            return $null` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0198 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0199 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0200 | `        try { $field.ClearAllFilters() } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0201 | `        try { $field.EnableMultiplePageItems = $false } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0202 | `        $field.CurrentPage = $matchedValue` | กำหนดค่าตัวแปร $field.CurrentPage สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0203 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0204 | `        if (-not [bool]$Pivot.RefreshTable()) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0205 | `            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Refresh หลังตั้ง Filter ไม่สำเร็จ" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0206 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0207 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0208 | `        $actualValue = Get-CurrentPivotPageName -Field $field` | กำหนดค่าตัวแปร $actualValue สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0209 | `        if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $matchedValue)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0210 | `            throw (New-BwError 'BW-FINALIZER-011' "Pivot $($Pivot.Name) Filter ไม่ตรง: ต้องเป็น '$matchedValue' แต่พบ '$actualValue'" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0211 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0212 | `        return "$($Pivot.Name)=$matchedValue"` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0213 | `    } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0214 | `        Release-ComObject $field` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0215 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0216 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0217 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0218 | `# อธิบาย: จัดการขั้นตอนย่อย Confirm-StrictReportPivotFilters ใน Excel finalizer` | คอมเมนต์ PowerShell เดิม ใช้อธิบายขั้นตอน ไม่ถูกรัน |
| L0219 | `function Confirm-StrictReportPivotFilters {` | ประกาศฟังก์ชัน Confirm-StrictReportPivotFilters เพื่อแยกขั้นตอนย่อยให้เรียกซ้ำและ debug ง่าย |
| L0220 | `    param($Sheet, [hashtable]$FilterMap, [int]$ExpectedCount)` | เริ่มประกาศ parameter ที่รับเข้ามาจากผู้ใช้หรือ batch file |
| L0221 | `    $verified = 0` | กำหนดค่าตัวแปร $verified สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0222 | `    $pivotTables = $null` | กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0223 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0224 | `        $pivotTables = $Sheet.PivotTables()` | กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0225 | `        for ($index = 1; $index -le [int]$pivotTables.Count; $index++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0226 | `            $pivot = $pivotTables.Item($index)` | กำหนดค่าตัวแปร $pivot สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0227 | `            $field = $null` | กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0228 | `            try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0229 | `                $pivotName = [string]$pivot.Name` | กำหนดค่าตัวแปร $pivotName สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0230 | `                if (-not $FilterMap.ContainsKey($pivotName)) { continue }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0231 | `                $field = Get-PivotFieldByName -Pivot $pivot -FieldName 'สถานะไม่ issue'` | กำหนดค่าตัวแปร $field สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0232 | `                if ($null -eq $field) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0233 | `                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ไม่พบ Filter Field" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0234 | `                }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0235 | `                $actualValue = Get-CurrentPivotPageName -Field $field` | กำหนดค่าตัวแปร $actualValue สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0236 | `                $expectedValue = [string]$FilterMap[$pivotName]` | กำหนดค่าตัวแปร $expectedValue สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0237 | `                if ((Normalize-BwPivotText $actualValue) -ne (Normalize-BwPivotText $expectedValue)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0238 | `                    throw (New-BwError 'BW-FINALIZER-011' "ตรวจหลัง Save: Pivot $pivotName ต้องเป็น '$expectedValue' แต่พบ '$actualValue'" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0239 | `                }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0240 | `                $verified++` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0241 | `            } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0242 | `                Release-ComObject $field` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0243 | `                Release-ComObject $pivot` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0244 | `            }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0245 | `        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0246 | `    } finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0247 | `        Release-ComObject $pivotTables` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0248 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0249 | `    if ($verified -ne $ExpectedCount) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0250 | `        throw (New-BwError 'BW-FINALIZER-011' "จำนวน Filter ที่ตรวจหลัง Save ไม่ตรง: คาด $ExpectedCount แต่พบ $verified" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0251 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0252 | `    return $verified` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน PowerShell |
| L0253 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0254 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0255 | `$excel = $null` | กำหนดค่าตัวแปร $excel สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0256 | `$workbook = $null` | กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0257 | `$verifyBook = $null` | กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0258 | `$logPath = $null` | กำหนดค่าตัวแปร $logPath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0259 | `$sourcePath = $null` | กำหนดค่าตัวแปร $sourcePath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0260 | `$outputPath = $null` | กำหนดค่าตัวแปร $outputPath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0261 | `$sheets = @{}` | กำหนดค่าตัวแปร $sheets สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0262 | `$audit = $null` | กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0263 | `$startedAt = Get-Date` | กำหนดค่าตัวแปร $startedAt สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0264 | `$reportFiltersApplied = 0` | กำหนดค่าตัวแปร $reportFiltersApplied สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0265 | `$reportFilterResults = @()` | กำหนดค่าตัวแปร $reportFilterResults สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0266 | `$appliedReportFilterMap = @{}` | กำหนดค่าตัวแปร $appliedReportFilterMap สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0267 | `$reportFilterMap = @{` | กำหนดค่าตัวแปร $reportFilterMap สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0268 | `    'PivotTable14' = 'รอ Issue'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0269 | `    'PivotTable5'  = 'ติดปัญหาไม่เข้าในเมนู E'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0270 | `    'PivotTable3'  = 'ข้อมูลไม่สมบูรณ์'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0271 | `    'PivotTable1'  = 'Blacklist'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0272 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0273 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0274 | `try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0275 | `    if (-not $InputPath) { $InputPath = Select-XlsxFile }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0276 | `    if (-not $InputPath) { Write-Host 'ยกเลิกการเลือกไฟล์'; exit 2 }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0277 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0278 | `    $sourcePath = [System.IO.Path]::GetFullPath($InputPath.Trim('"'))` | กำหนดค่าตัวแปร $sourcePath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0279 | `    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0280 | `        throw (New-BwError 'BW-FINALIZER-001' "ไม่พบไฟล์: $sourcePath" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0281 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0282 | `    if ([System.IO.Path]::GetExtension($sourcePath).ToLowerInvariant() -ne '.xlsx') {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0283 | `        throw (New-BwError 'BW-FINALIZER-002' 'Finalizer รองรับเฉพาะไฟล์ .xlsx' $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0284 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0285 | `    if (-not (Test-ExcelInstalled)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0286 | `        throw (New-BwError 'BW-FINALIZER-003' 'ไม่พบ Microsoft Excel Desktop ในเครื่อง' $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0287 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0288 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0289 | `    $folder = [System.IO.Path]::GetDirectoryName($sourcePath)` | กำหนดค่าตัวแปร $folder สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0290 | `    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($sourcePath)` | กำหนดค่าตัวแปร $baseName สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0291 | `    if ($baseName.EndsWith('_FINAL', [System.StringComparison]::OrdinalIgnoreCase)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0292 | `        $baseName = $baseName.Substring(0, $baseName.Length - 6)` | กำหนดค่าตัวแปร $baseName สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0293 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0294 | `    $outputPath = Join-Path $folder ($baseName + '_FINAL.xlsx')` | กำหนดค่าตัวแปร $outputPath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0295 | `    $logPath = Join-Path $folder ($baseName + '_FINALIZER_LOG.txt')` | กำหนดค่าตัวแปร $logPath สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0296 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0297 | `    if (Test-Path -LiteralPath $outputPath) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0298 | `        $backup = Join-Path $folder ($baseName + '_FINAL_BACKUP_' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.xlsx')` | กำหนดค่าตัวแปร $backup สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0299 | `        Move-Item -LiteralPath $outputPath -Destination $backup -Force` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0300 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0301 | `    Copy-Item -LiteralPath $sourcePath -Destination $outputPath -Force` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0302 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0303 | `    "BLACKWOLF V3.5.8 Excel Finalizer\`r\`nStarted: $($startedAt.ToString('s'))\`r\`nSource: $sourcePath\`r\`nOutput: $outputPath" \| Set-Content -LiteralPath $logP...` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0304 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0305 | `    $excel = New-Object -ComObject Excel.Application` | กำหนดค่าตัวแปร $excel สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0306 | `    $excel.Visible = $false` | กำหนดค่าตัวแปร $excel.Visible สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0307 | `    $excel.DisplayAlerts = $false` | กำหนดค่าตัวแปร $excel.DisplayAlerts สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0308 | `    $excel.EnableEvents = $false` | กำหนดค่าตัวแปร $excel.EnableEvents สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0309 | `    $excel.AskToUpdateLinks = $false` | กำหนดค่าตัวแปร $excel.AskToUpdateLinks สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0310 | `    try { $excel.AutomationSecurity = 3 } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0311 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0312 | `    $workbook = $excel.Workbooks.Open($outputPath, 0, $false)` | กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0313 | `    $requiredSheets = @('Data', 'PV', 'PV Final', 'Report')` | กำหนดค่าตัวแปร $requiredSheets สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0314 | `    $sheets = @{}` | กำหนดค่าตัวแปร $sheets สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0315 | `    foreach ($name in $requiredSheets) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0316 | `        $sheet = Get-WorksheetByName -Workbook $workbook -Name $name` | กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0317 | `        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-005' "ไม่พบ Sheet ที่จำเป็น: $name" $null) }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0318 | `        $sheets[$name] = $sheet` | กำหนดค่าตัวแปร $sheets[$name] สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0319 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0320 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0321 | `    $deadline = (Get-Date).AddMinutes($TimeoutMinutes)` | กำหนดค่าตัวแปร $deadline สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0322 | `    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] RefreshAll started"` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0323 | `    $workbook.RefreshAll()` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0324 | `    try { $excel.CalculateFullRebuild() } catch { $excel.CalculateFull() }` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0325 | `    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Refresh All'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0326 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0327 | `    $cacheCount = 0` | กำหนดค่าตัวแปร $cacheCount สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0328 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0329 | `        $caches = $workbook.PivotCaches()` | กำหนดค่าตัวแปร $caches สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0330 | `        try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0331 | `            $cacheCount = [int]$caches.Count` | กำหนดค่าตัวแปร $cacheCount สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0332 | `            for ($index = 1; $index -le $cacheCount; $index++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0333 | `                $cache = $caches.Item($index)` | กำหนดค่าตัวแปร $cache สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0334 | `                try { $cache.Refresh() } finally { Release-ComObject $cache }` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0335 | `            }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0336 | `        } finally { Release-ComObject $caches }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0337 | `    } catch {` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0338 | `        throw (New-BwError 'BW-FINALIZER-006' 'Refresh Pivot Cache ไม่สำเร็จ' $_.Exception)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0339 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0340 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0341 | `    $pivotCounts = @{}` | กำหนดค่าตัวแปร $pivotCounts สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0342 | `    foreach ($name in @('PV', 'Report')) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0343 | `        $sheet = $sheets[$name]` | กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0344 | `        $count = Get-PivotCount -Sheet $sheet` | กำหนดค่าตัวแปร $count สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0345 | `        $pivotCounts[$name] = $count` | กำหนดค่าตัวแปร $pivotCounts[$name] สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0346 | `        if ($count -lt 1) { throw (New-BwError 'BW-FINALIZER-007' "Sheet $name ไม่มี PivotTable" $null) }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0347 | `        $pivotTables = $sheet.PivotTables()` | กำหนดค่าตัวแปร $pivotTables สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0348 | `        try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0349 | `            for ($index = 1; $index -le $count; $index++) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0350 | `                $pivot = $pivotTables.Item($index)` | กำหนดค่าตัวแปร $pivot สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0351 | `                try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0352 | `                    try { $pivot.EnableDrilldown = $true } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0353 | `                    $handledReportFilter = $false` | กำหนดค่าตัวแปร $handledReportFilter สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0354 | `                    if ($name -eq 'Report') {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0355 | `                        $pivotName = [string]$pivot.Name` | กำหนดค่าตัวแปร $pivotName สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0356 | `                        if ($reportFilterMap.ContainsKey($pivotName)) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0357 | `                            $handledReportFilter = $true` | กำหนดค่าตัวแปร $handledReportFilter สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0358 | `                            $targetStatus = [string]$reportFilterMap[$pivotName]` | กำหนดค่าตัวแปร $targetStatus สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0359 | `                            $result = Set-StrictReportPivotFilter -Pivot $pivot -FieldName 'สถานะไม่ issue' -TargetValue $targetStatus` | กำหนดค่าตัวแปร $result สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0360 | `                            if ($result) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0361 | `                                $reportFilterResults += $result` | กำหนดค่าตัวแปร $reportFilterResults + สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0362 | `                                $appliedReportFilterMap[$pivotName] = $targetStatus` | กำหนดค่าตัวแปร $appliedReportFilterMap[$pivotName] สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0363 | `                                $reportFiltersApplied++` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0364 | `                            } else {` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0365 | `                                $reportFilterResults += "$pivotName=NO_DATA"` | กำหนดค่าตัวแปร $reportFilterResults + สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0366 | `                            }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0367 | `                        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0368 | `                    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0369 | `                    if (-not $handledReportFilter) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0370 | `                        if (-not [bool]$pivot.RefreshTable()) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0371 | `                            throw (New-BwError 'BW-FINALIZER-008' "Refresh PivotTable $name #$index ไม่สำเร็จ" $null)` | หยุด script ด้วย error เมื่อไม่สามารถดำเนินการต่อได้อย่างปลอดภัย |
| L0372 | `                        }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0373 | `                    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0374 | `                } finally { Release-ComObject $pivot }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0375 | `            }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0376 | `        } finally { Release-ComObject $pivotTables }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0377 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0378 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0379 | `    Wait-ForExcelReady -Excel $excel -Workbook $workbook -Deadline $deadline -Stage 'Pivot refresh'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0380 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0381 | `    $pvFinalTables = 0` | กำหนดค่าตัวแปร $pvFinalTables สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0382 | `    try { $pvFinalTables = [int]$sheets['PV Final'].ListObjects.Count } catch {}` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0383 | `    if ($pvFinalTables -lt 1) { throw (New-BwError 'BW-FINALIZER-009' 'PV Final ไม่มี Excel Table' $null) }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0384 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0385 | `    $audit = Get-WorksheetByName -Workbook $workbook -Name '_Audit'` | กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0386 | `    if ($null -eq $audit) {` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0387 | `        $audit = $workbook.Worksheets.Add()` | กำหนดค่าตัวแปร $audit สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0388 | `        $audit.Name = '_Audit'` | กำหนดค่าตัวแปร $audit.Name สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0389 | `        $audit.Cells.Item(1,1).Value2 = 'Key'` | กำหนดค่าตัวแปร $audit.Cells.Item(1,1).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0390 | `        $audit.Cells.Item(1,2).Value2 = 'Value'` | กำหนดค่าตัวแปร $audit.Cells.Item(1,2).Value2 สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0391 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0392 | `    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerStatus' -Value 'PASSED'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0393 | `    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizerVersion' -Value '3.5.8'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0394 | `    Set-AuditValue -Sheet $audit -Key 'ExcelFinalizedAt' -Value ((Get-Date).ToString('o'))` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0395 | `    Set-AuditValue -Sheet $audit -Key 'PVWorkbookMode' -Value 'FINALIZED_BY_MICROSOFT_EXCEL'` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0396 | `    Set-AuditValue -Sheet $audit -Key 'PivotCacheCountAfterRefresh' -Value $cacheCount` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0397 | `    Set-AuditValue -Sheet $audit -Key 'PVPivotCountAfterRefresh' -Value $pivotCounts['PV']` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0398 | `    Set-AuditValue -Sheet $audit -Key 'ReportPivotCountAfterRefresh' -Value $pivotCounts['Report']` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0399 | `    Set-AuditValue -Sheet $audit -Key 'ReportStatusFiltersApplied' -Value $reportFiltersApplied` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0400 | `    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterErrors' -Value 0` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0401 | `    Set-AuditValue -Sheet $audit -Key 'ReportStatusFilterMap' -Value ($reportFilterResults -join '; ')` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0402 | `    Set-AuditValue -Sheet $audit -Key 'ReportNoDataPivots' -Value (($reportFilterResults \| Where-Object { $_ -like '*=NO_DATA' }) -join '; ')` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0403 | `    Set-AuditValue -Sheet $audit -Key 'PVFinalTableCount' -Value $pvFinalTables` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0404 | `    $audit.Visible = 0` | กำหนดค่าตัวแปร $audit.Visible สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0405 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0406 | `    $workbook.Save()` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0407 | `    $workbook.Close($true)` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0408 | `    Release-ComObject $workbook` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0409 | `    $workbook = $null` | กำหนดค่าตัวแปร $workbook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0410 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0411 | `    $verifyBook = $excel.Workbooks.Open($outputPath, 0, $true)` | กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0412 | `    foreach ($name in $requiredSheets) {` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0413 | `        $sheet = Get-WorksheetByName -Workbook $verifyBook -Name $name` | กำหนดค่าตัวแปร $sheet สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0414 | `        if ($null -eq $sheet) { throw (New-BwError 'BW-FINALIZER-010' "ตรวจซ้ำหลัง Save แล้วไม่พบ Sheet: $name" $null) }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0415 | `        Release-ComObject $sheet` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0416 | `    }` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0417 | `    $verifyReport = Get-WorksheetByName -Workbook $verifyBook -Name 'Report'` | กำหนดค่าตัวแปร $verifyReport สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0418 | `    try {` | เริ่มส่วนคำสั่งที่อาจเกิด error เพื่อให้จับข้อผิดพลาดได้ |
| L0419 | `        $verifiedReportFilters = Confirm-StrictReportPivotFilters -Sheet $verifyReport -FilterMap $appliedReportFilterMap -ExpectedCount $reportFiltersApplied` | กำหนดค่าตัวแปร $verifiedReportFilters สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0420 | `    } finally { Release-ComObject $verifyReport }` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0421 | `    $verifyBook.Close($false)` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0422 | `    Release-ComObject $verifyBook` | คืน COM object เพื่อลดโอกาส Excel.exe ค้างหลังรันเสร็จ |
| L0423 | `    $verifyBook = $null` | กำหนดค่าตัวแปร $verifyBook สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0424 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งช่วงคำสั่งให้อ่านง่าย |
| L0425 | `    $elapsed = [Math]::Round(((Get-Date) - $startedAt).TotalSeconds, 1)` | กำหนดค่าตัวแปร $elapsed สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0426 | `    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] PASSED in $elapsed seconds\`r\`nPivotCaches=$cacheCount; PV=$($pivotCounts['PV']); Report...` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0427 | `    Write-Host ''` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0428 | `    Write-Host 'FINALIZER PASSED' -ForegroundColor Green` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0429 | `    Write-Host "ไฟล์พร้อมตรวจขั้นสุดท้าย: $outputPath"` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0430 | `    Write-Host "Log: $logPath"` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0431 | `    exit 0` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0432 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0433 | `catch {` | จับ error ที่เกิดจาก try แล้วจัดการต่อ เช่น ข้าม แจ้งเตือน หรือ throw ใหม่ |
| L0434 | `    $message = $_.Exception.Message` | กำหนดค่าตัวแปร $message สำหรับใช้ในขั้นตอน PowerShell นี้ |
| L0435 | `    if ($logPath) { try { Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] FAILED\`r\`n$message\`r\`n$($_.ScriptStackTrace)" } catch {} }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0436 | `    Write-Host ''` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0437 | `    Write-Host 'FINALIZER FAILED' -ForegroundColor Red` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0438 | `    Write-Host $message -ForegroundColor Red` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0439 | `    if ($logPath) { Write-Host "Log: $logPath" }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0440 | `    exit 1` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0441 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0442 | `finally {` | คำสั่งที่ต้องทำเสมอ เช่น release COM object เพื่อไม่ให้ Excel ค้าง |
| L0443 | `    foreach ($sheet in @($sheets.Values)) { Release-ComObject $sheet }` | วน loop เพื่อทำงานซ้ำกับ worksheet, connection, pivot หรือรายการไฟล์ |
| L0444 | `    if ($audit) { Release-ComObject $audit }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0445 | `    if ($verifyBook) { try { $verifyBook.Close($false) } catch {}; Release-ComObject $verifyBook }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0446 | `    if ($workbook) { try { $workbook.Close($false) } catch {}; Release-ComObject $workbook }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0447 | `    if ($excel) { try { $excel.Quit() } catch {}; Release-ComObject $excel }` | ตรวจเงื่อนไขก่อนตัดสินใจว่าจะทำคำสั่งใน block นี้หรือไม่ |
| L0448 | `    [GC]::Collect()` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0449 | `    [GC]::WaitForPendingFinalizers()` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
| L0450 | `}` | คำสั่ง PowerShell ใน flow finalizer ใช้ตรวจ/refresh/บันทึก workbook และ log สถานะ |
