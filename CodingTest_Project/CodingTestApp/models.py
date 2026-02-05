from django.db import models

# Create your models here.

class Student(models.Model):
    student_name=models.CharField(max_length=100)
    student_email=models.EmailField(primary_key=True)
    student_id=models.CharField(max_length=20,null=True,blank=True)
    student_password=models.CharField(max_length=20,null=True,blank=True)
    student_dob=models.DateField()
    exam_date=models.DateField(null=True,blank=True)
    is_active=models.BooleanField(default=True)
    def __str__(self):
        return f" {self.student_email}"

class Result(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE,related_name='results')
    marks_obtained=models.IntegerField(default=0)
    total_marks=models.IntegerField(default=10)
    result=models.CharField(max_length=10,blank=True,null=True)

class Question(models.Model):
    question_text=models.TextField(max_length=200)
    choice=models.JSONField()
    correct_answer=models.CharField(max_length=100)
    marks=models.IntegerField(default=0)
    def __str__(self):
        return f" {self.question_text}"