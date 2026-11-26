lms-platform/
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                 # تشغيل الاختبارات تلقائيًا على GitHub
├── Dockerfile
├── docker-compose.yml             # api + postgres + redis + worker
├── package.json
├── README.md
├── prisma/                        # أو مجلد migrations لو بتستخدم Knex
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js                    # بيانات تجريبية (أدمن، مدرس، طالب، كورس)
├── src/
│   ├── server.js                  # تشغيل السيرفر والاتصال بقاعدة البيانات
│   ├── app.js                     # إعداد Express والـ middleware والـ routes
│   ├── config/
│   │   ├── env.js                 # قراءة والتحقق من متغيرات البيئة
│   │   ├── db.js
│   │   ├── redis.js
│   │   ├── stripe.js
│   │   ├── storage.js             # Cloudinary أو S3
│   │   └── mailer.js
│   ├── middleware/ done 
│   │   ├── auth.js                # التحقق من الـ JWT
│   │   ├── roles.js               # requireRole('instructor')
│   │   ├── ownership.js           # هل الكورس بتاع المدرس ده؟
│   │   ├── enrolled.js            # هل الطالب مشترك في الكورس؟
│   │   ├── validate.js            # التحقق من المدخلات (Zod/Joi)
│   │   ├── upload.js              # Multer
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.schema.js     # قواعد التحقق
│   │   ├── users/    donne 
│   │   ├── categories/ done 
│   │   ├── courses/ done 
│   │   ├── sections/ done
│   │   ├── lessons/ done
│   │   ├── enrollments/ done
│   │   ├── progress/ done
│   │   ├── quizzes/ done done
│   │   ├── attempts/
│   │   │   ├── attempts.routes.js
│   │   │   ├── attempts.controller.js
│   │   │   ├── attempts.service.js
│   │   │   └── grading.js         # دالة gradeAnswers
│   │   ├── certificates/
│   │   │   ├── certificates.routes.js
│   │   │   ├── certificates.controller.js
│   │   │   ├── certificates.service.js
│   │   │   └── pdf.js             # رسم الشهادة بـ PDFKit
│   │   ├── payments/ done
│   │   │   ├── payments.routes.js
│   │   │   ├── payments.controller.js
│   │   │   ├── payments.service.js
│   │   │   └── stripe.webhook.js  # يستخدم raw body
│   │   ├── reviews/
│   │   ├── notifications/
│   │   └── admin/
│   ├── jobs/
│   │   ├── queue.js               # إعداد BullMQ
│   │   ├── worker.js              # تشغيل العمال (process منفصل)
│   │   ├── sendEmail.job.js
│   │   └── generateCertificate.job.js
│   ├── routes/
│   │   └── index.js               # تجميع كل الـ routes تحت /api/v1
│   ├── docs/
│   │   └── openapi.yaml           # توثيق Swagger
│   └── utils/
│       ├── AppError.js
│       ├── logger.js
│       ├── pagination.js
│       ├── tokens.js              # إنشاء JWT
│       └── codes.js               # كود الشهادة الفريد
└── tests/
    ├── setup.js                   # قاعدة بيانات الاختبار
    ├── unit/
    │   ├── grading.test.js
    │   ├── progress.test.js
    │   └── certificate-eligibility.test.js
    └── integration/
        ├── auth.test.js
        ├── enrollment.test.js
        ├── quiz.test.js
        ├── payments.test.js
        └── security.test.js       # طالب غير مشترك لا يرى المحتوى، إلخ
        