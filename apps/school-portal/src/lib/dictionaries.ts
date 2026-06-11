const dictionaries = {
  en: {
    title: "School News",
    welcome: "Welcome to our school!",
    login: {
      title: "Teacher Portal",
      subtitle: "Please sign in to manage news and grades.",
      email: "Email Address",
      password: "Password",
      button: "Sign In",
      back: "← Back to School"
    },
    gallery: {
      title: "Art Gallery",
      subtitle: "Celebrating student creativity anonymously",
      next: "New Masterpiece",
      adminTitle: "Teacher Admin: Bulk Upload",
      noArt: "No artwork has been uploaded yet."
    },
  },
  th: {
    title: "ข่าวโรงเรียน",
    welcome: "ยินดีต้อนรับสู่โรงเรียนของเรา!",
    login: {
      title: "พอร์ทัลสำหรับครู",
      subtitle: "กรุณาเข้าสู่ระบบเพื่อจัดการข่าวสารและผลการเรียน",
      email: "ที่อยู่อีเมล",
      password: "รหัสผ่าน",
      button: "เข้าสู่ระบบ",
      back: "← กลับสู่หน้าหลัก"
    },
    gallery: {
      title: "หอศิลป์",
      subtitle: "เฉลิมฉลองความคิดสร้างสรรค์ของนักเรียน",
      next: "ชมผลงานชิ้นต่อไป",
      adminTitle: "สำหรับครู: อัปโหลดรูปภาพจำนวนมาก",
      noArt: "ยังไม่มีผลงานศิลปะในขณะนี้"
    },
  },
  zh: {
    title: "学校新闻",
    welcome: "欢迎来到我们的学校！",
    login: {
      title: "教师门户",
      subtitle: "请登录以管理新闻和成绩。",
      email: "电子邮件地址",
      password: "密码",
      button: "登录",
      back: "← 回到学校"
    },
    gallery: {
      title: "学生艺术馆",
      subtitle: "匿名庆祝学生的创造力",
      next: "下一件杰作",
      adminTitle: "教师管理：批量上传",
      noArt: "尚未上传任何作品。"
    },
  },
}

export const getDictionary = (lang: 'en' | 'th' | 'zh') => dictionaries[lang]