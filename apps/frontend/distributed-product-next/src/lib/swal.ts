import Swal from "sweetalert2";

export const swal = {
  success: (title: string, text?: string) =>
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonText: "ตกลง",
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "ตกลง",
    }),

  warning: (title: string, text?: string) =>
    Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonText: "ตกลง",
    }),

  info: (title: string, text?: string) =>
    Swal.fire({
      icon: "info",
      title,
      text,
      confirmButtonText: "ตกลง",
    }),

  confirm: (
    title: string,
    text?: string
  ) =>
    Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }),
};