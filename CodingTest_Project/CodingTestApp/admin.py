from django.contrib import admin
from  . models import Student
from . models import Result
from . models import Question

# Register your models here.
class StudentAdmin(admin.ModelAdmin):
    list_display=["student_name","student_email","student_id","student_password","student_dob","exam_date",]
admin.site.register(Student,StudentAdmin)

class ResultAdmin(admin.ModelAdmin):
    list_display=["student_id","student_email","student_name","is_active","marks_obtained","total_marks","result"]   
    def student_id(self,obj):
        return obj.student.student_id 
    def student_email(self,obj):
        return obj.student.student_email
    def student_name(self,obj):
        return obj.student.student_name
    def is_active(self,obj):
        return obj.student.is_active

admin.site.register(Result,ResultAdmin)

class QuestionAdmin(admin.ModelAdmin):
    list_display=["id","question_text","choice","correct_answer","marks",]
admin.site.register(Question,QuestionAdmin)