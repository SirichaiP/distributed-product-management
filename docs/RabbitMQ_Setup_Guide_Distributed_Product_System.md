# คู่มือการ Set up RabbitMQ ด้วย Docker สำหรับ Distributed Product System

คู่มือนี้ใช้สำหรับเปิด RabbitMQ ด้วย Docker เพื่อให้ Backend/API สามารถเชื่อมต่อ RabbitMQ ได้ และช่วยแก้ปัญหาเช่น `500 Internal Server Error` ตอนกด Save Product หากสาเหตุเกิดจาก RabbitMQ ยังไม่เปิดหรือเชื่อมต่อไม่ได้

---

## 1. สิ่งที่ต้องมี

ก่อนเริ่มต้น ต้องติดตั้งและเปิดใช้งาน:

- Docker Desktop
- PowerShell หรือ Command Prompt
- Backend API ของโปรเจกต์
- Frontend ของโปรเจกต์

ตรวจสอบ Docker ด้วยคำสั่ง:

```powershell
docker --version
```

ตัวอย่างผลลัพธ์:

```text
Docker version 29.5.2, build 79eb04c
```

ถ้าเห็น version แปลว่า Docker พร้อมใช้งาน

---

## 2. เปิด RabbitMQ ด้วย Docker

แนะนำให้ใช้คำสั่งแบบบรรทัดเดียวใน PowerShell:

```powershell
docker run -d --name rabbitmq-distributed-product -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management
```

คำสั่งนี้จะ:

- ดาวน์โหลด image `rabbitmq:3-management` ถ้ายังไม่มีในเครื่อง
- สร้าง container ชื่อ `rabbitmq-distributed-product`
- เปิด port `5672` สำหรับ Backend เชื่อมต่อ RabbitMQ
- เปิด port `15672` สำหรับหน้า RabbitMQ Management UI
- ตั้ง username/password เป็น `guest/guest`

---

## 3. ความหมายของ Port

| Port | ใช้ทำอะไร |
|---|---|
| `5672` | สำหรับ Application / Backend เชื่อมต่อ RabbitMQ |
| `15672` | สำหรับเปิดหน้า RabbitMQ Management UI ผ่าน Browser |

สำคัญ: Backend ต้องใช้ port `5672` ไม่ใช่ `15672`

---

## 4. ตรวจสอบว่า RabbitMQ เปิดแล้วหรือยัง

ใช้คำสั่ง:

```powershell
docker ps
```

ถ้า RabbitMQ เปิดสำเร็จ จะเห็นประมาณนี้:

```text
CONTAINER ID   IMAGE                   STATUS          PORTS                                                                                          NAMES
95ace8063b59   rabbitmq:3-management   Up About a minute   0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp   rabbitmq-distributed-product
```

จุดที่ต้องดู:

```text
STATUS = Up
PORTS  = 5672 และ 15672
NAMES  = rabbitmq-distributed-product
```

ถ้าเห็นแบบนี้ แปลว่า RabbitMQ พร้อมใช้งานแล้ว

---

## 5. เปิด RabbitMQ Management UI

เปิด Browser แล้วเข้า:

```text
http://localhost:15672
```

Login ด้วย:

```text
Username: guest
Password: guest
```

ถ้าเข้าได้ แปลว่า RabbitMQ container ทำงานปกติ

---

## 6. ถ้า Container เคยสร้างไว้แล้ว

ถ้ารันคำสั่ง `docker run` ซ้ำ แล้วเจอ error แบบนี้:

```text
Conflict. The container name "/rabbitmq-distributed-product" is already in use
```

แปลว่า container ถูกสร้างไว้แล้ว ไม่ต้องสร้างใหม่ ให้ start แทน:

```powershell
docker start rabbitmq-distributed-product
```

จากนั้นตรวจสอบ:

```powershell
docker ps
```

---

## 7. ถ้าไม่เห็น RabbitMQ ใน `docker ps`

ให้ดู container ทั้งหมดด้วย:

```powershell
docker ps -a
```

ถ้าเห็น container ชื่อ `rabbitmq-distributed-product` แต่สถานะเป็น `Exited` ให้เปิดด้วย:

```powershell
docker start rabbitmq-distributed-product
```

แล้วเช็กอีกครั้ง:

```powershell
docker ps
```

---

## 8. คำสั่งที่ใช้บ่อย

### ดู container ที่กำลังรัน

```powershell
docker ps
```

### ดู container ทั้งหมด ทั้งที่รันและหยุดอยู่

```powershell
docker ps -a
```

### Start RabbitMQ

```powershell
docker start rabbitmq-distributed-product
```

### Stop RabbitMQ

```powershell
docker stop rabbitmq-distributed-product
```

### Restart RabbitMQ

```powershell
docker restart rabbitmq-distributed-product
```

### ดู Log ของ RabbitMQ

```powershell
docker logs rabbitmq-distributed-product
```

### ลบ container RabbitMQ

ใช้เมื่อต้องการสร้างใหม่เท่านั้น:

```powershell
docker rm -f rabbitmq-distributed-product
```

จากนั้นสร้างใหม่ด้วย:

```powershell
docker run -d --name rabbitmq-distributed-product -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management
```

---

## 9. ตัวอย่าง Config Backend

ใน `appsettings.json` ควรตั้งค่า RabbitMQ ประมาณนี้:

```json
{
  "RabbitMQ": {
    "Host": "localhost",
    "Port": 5672,
    "Username": "guest",
    "Password": "guest"
  }
}
```

หรือถ้าใช้ Environment Variable:

```env
RabbitMQ__Host=localhost
RabbitMQ__Port=5672
RabbitMQ__Username=guest
RabbitMQ__Password=guest
```

---

## 10. หลังจากเปิด RabbitMQ แล้วต้องทำอะไรต่อ

หลังจาก RabbitMQ รันแล้ว แนะนำให้ Restart Backend API ใหม่

ตัวอย่าง:

```powershell
dotnet run
```

หรือถ้าใช้ Visual Studio:

1. กด Stop
2. กด Start ใหม่
3. ตรวจสอบ Console ว่าไม่มี error เรื่อง RabbitMQ
4. กลับไปหน้า Frontend
5. ลองกด Save Product ใหม่

---

## 11. Error ที่พบบ่อย

### 11.1 พิมพ์ชื่อ container แล้วขึ้น error

ตัวอย่าง:

```powershell
rabbitmq-distributed-product
```

แล้วเจอ error:

```text
The term 'rabbitmq-distributed-product' is not recognized as the name of a cmdlet
```

สาเหตุ:

`rabbitmq-distributed-product` คือชื่อ container ไม่ใช่คำสั่ง PowerShell

คำสั่งที่ถูกต้องคือ:

```powershell
docker start rabbitmq-distributed-product
```

หรือ:

```powershell
docker ps
```

---

### 11.2 Container name already in use

Error:

```text
Conflict. The container name "/rabbitmq-distributed-product" is already in use
```

วิธีแก้:

```powershell
docker start rabbitmq-distributed-product
```

ถ้าต้องการลบแล้วสร้างใหม่:

```powershell
docker rm -f rabbitmq-distributed-product
```

แล้วรัน:

```powershell
docker run -d --name rabbitmq-distributed-product -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management
```

---

### 11.3 Backend ยังขึ้น 500 หลังเปิด RabbitMQ แล้ว

ให้ตรวจสอบ Log ฝั่ง Backend

ถ้าเจอข้อความประมาณนี้:

```text
BrokerUnreachableException
Connection refused
No connection could be made
RabbitMQ.Client.Exceptions
```

แปลว่า Backend ยังต่อ RabbitMQ ไม่ได้ ให้เช็ก:

- RabbitMQ ยัง `Up` อยู่หรือไม่ ด้วย `docker ps`
- Backend config ใช้ `localhost:5672` หรือไม่
- Restart Backend แล้วหรือยัง
- มี firewall หรือ port conflict หรือไม่

ถ้า error ไม่เกี่ยวกับ RabbitMQ เช่น:

```text
SQL error
Validation error
NullReferenceException
Foreign key error
CategoryId is invalid
```

แปลว่า RabbitMQ ผ่านแล้ว แต่ปัญหาอยู่ที่ส่วนอื่นของ Backend/API

---

## 12. ลำดับการทำงานที่แนะนำ

ใช้ลำดับนี้เมื่อต้องการเปิดระบบทุกครั้ง:

```powershell
docker ps -a
docker start rabbitmq-distributed-product
docker ps
```

จากนั้นเปิด:

```text
http://localhost:15672
```

Login:

```text
guest / guest
```

แล้ว Restart Backend API และลองใช้งาน Frontend ใหม่

---

## 13. Checklist ตรวจสอบก่อน Save Product

ก่อนกด Save Product ให้ตรวจสอบ:

- [ ] Docker Desktop เปิดอยู่
- [ ] RabbitMQ container เป็นสถานะ `Up`
- [ ] Port `5672` เปิดให้ Backend
- [ ] Port `15672` เข้า Management UI ได้
- [ ] Backend config ใช้ `localhost:5672`
- [ ] Backend ถูก Restart หลังเปิด RabbitMQ
- [ ] Frontend เรียก API Gateway/Backend URL ถูกต้อง

---

## 14. สรุปคำสั่งหลัก

```powershell
docker run -d --name rabbitmq-distributed-product -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management
```

ตรวจสอบ:

```powershell
docker ps
```

เปิด container ที่หยุดอยู่:

```powershell
docker start rabbitmq-distributed-product
```

เปิดหน้า Management:

```text
http://localhost:15672
```

Login:

```text
guest / guest
```

---

## หมายเหตุ

สำหรับ Development environment สามารถใช้ username/password เป็น `guest/guest` ได้ แต่ถ้าเป็น Production ควรเปลี่ยน username/password และตั้งค่าความปลอดภัยเพิ่มเติม
