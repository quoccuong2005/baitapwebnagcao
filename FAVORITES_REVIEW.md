# Nhận xét lựa chọn Zustand

Zustand có API ngắn gọn, dễ đọc và phù hợp với một state nhỏ như danh sách yêu thích.
Store hoạt động độc lập với cây component nên nhiều màn hình có thể dùng chung mà không cần bọc Provider.
Việc subscribe theo từng phần state giúp component chỉ render lại khi dữ liệu nó dùng thay đổi.
So với Redux Toolkit, Zustand ít boilerplate hơn và không cần slice, action creator hay cấu hình store trung tâm.
Đổi lại, Zustand cung cấp ít quy ước và middleware chuẩn hơn, nên dự án lớn cần tự thống nhất kiến trúc.
Redux Toolkit phù hợp hơn khi cần DevTools, middleware, kiểm soát luồng dữ liệu và tính nhất quán ở quy mô lớn.
