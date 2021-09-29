export default {
  mainModuleName: "lineUser",
  titleName: "ลูกค้า",
  tableHeader: [
    {
      text: "ชื่อ",
      sortable: true,
      value: "firstName",
    },
    {
      text: "นามสกุล",
      sortable: true,
      value: "lastName",
    },
    {
      text: "เบอร์โทร",
      sortable: true,
      value: "tel",
    },
    {
      text: "อีเมล",
      sortable: true,
      value: "email",
    },

    { text: "เพศ", value: "gender" },
    {
      text: "สมัครเมื่อ",
      sortable: true,
      value: "createdAt",
    },
  ],
}
