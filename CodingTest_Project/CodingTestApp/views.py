from django.shortcuts import render, redirect
from .models import Student, Result, Question
from .form import StudentForm
from django.contrib import messages
from urllib.parse import unquote
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from datetime import datetime
import time
import random
from django.db import transaction
from django.db.models import Case, When


def loginpage(request):
    try:
        if request.method == "POST":
            loginId = request.POST.get('loginId')
            password = request.POST.get('password')

            student = Student.objects.get(
                student_id=loginId,
                student_password=password
            )

            if not student.is_active:
                messages.error(request, "Your exam is already given")
                return render(request, 'login.html')

            Student.objects.filter(student_id=loginId).update(is_active=False)
            request.session["student_id"] = student.student_id
            request.session["start_time"] = int(time.time())
            request.session.set_expiry(3600)  # ⏱️ 3600 seconds

            return redirect("/testpage")

    except Exception as e:
        print(e)
        messages.error(request, "Invalid username or password")

    return render(request, 'login.html')

# @ensure_csrf_cookie
# def testpage(request):
#     student_id = request.session.get("student_id")
#     if not student_id:
#         return redirect("login")

#     start_time = request.session.get("start_time")
#     duration = 3600  # 1 hour in seconds

#     elapsed = int(time.time()) - start_time
#     remaining_time = duration - elapsed

    

#     student = Student.objects.get(student_id=student_id)

#     # 🎯 Select 10 questions ONCE
#     if "question_ids" not in request.session:
#         ids = list(Question.objects.values_list("id", flat=True))
#         random_ids = random.sample(ids, 50)
#         request.session["question_ids"] = random_ids
#         print("Selected Question IDs:", request.session["question_ids"])
#     #questions = Question.objects.filter(id__in=request.session["question_ids"])
#     #   questions = Question.objects.all()  # TEMPORARY: Use all questions
#     print("Questions for this session:", questions)
#     # 🔀 Shuffle choices
#     for q in questions:
#         print("Original Choices:", q.choice)
#         q.shuffled_choices = q.choice.copy()
#         random.shuffle(q.shuffled_choices)
    
#     if remaining_time <= 0:
#         return redirect("submit")

#     return render(request, "test.html", {
#         "student": student,
#         "questions": questions,
#         "remaining_time": remaining_time
#     })


# @ensure_csrf_cookie
# def testpage(request):
@ensure_csrf_cookie
def testpage(request):
    student_id = request.session.get("student_id")
    if not student_id:
        return redirect("login")

    start_time = request.session.get("start_time")
    duration = 3600

    elapsed = int(time.time()) - start_time
    remaining_time = duration - elapsed

    if remaining_time <= 0:
        return redirect("submit")

    student = Student.objects.get(student_id=student_id)

    # 🎯 Generate 50 random questions ONCE
    if "question_ids" not in request.session:
        ids = list(Question.objects.values_list("id", flat=True))
        request.session["question_ids"] = random.sample(ids, 50)

    question_ids = request.session["question_ids"]

    # 🔥 Preserve random order
    questions = Question.objects.filter(id__in=question_ids).order_by(
        Case(*[When(id=qid, then=pos) for pos, qid in enumerate(question_ids)])
    )

    # 🔀 Shuffle choices + 🔥 SPLIT QUESTION & CODE HERE
    for q in questions:
        # choices
        q.shuffled_choices = q.choice.copy()
        random.shuffle(q.shuffled_choices)

        # 🔥 TEXT / CODE SEPARATION USING :
        if 'of :' in q.question_text:
            q.question_part, q.code_part = q.question_text.split('of :', 1)
        else:
            q.question_part = q.question_text
            q.code_part = None

    return render(request, "test.html", {
        "student": student,
        "questions": questions,
        "remaining_time": remaining_time
    })


@transaction.atomic
@csrf_exempt
def submit_test(request):

    if request.method == "POST":

        student_id = request.session.get("student_id")
        if not student_id:
            return redirect("login")

        student = Student.objects.get(student_id=student_id)

        question_ids = request.session.get("question_ids", [])
        questions = Question.objects.filter(id__in=question_ids)
        print("Submitted Question IDs:", question_ids)

        total_marks = 0
        marks_obtained = 0

        for question in questions:

            total_marks += question.marks

            selected_answer = request.POST.get(f"q{question.id}")

            if selected_answer == question.correct_answer:
                marks_obtained += question.marks
            else:
                print(f"Wrong Answer for Q{question.id}: Selected {selected_answer}, Correct {question.correct_answer}")

        result_status = "Pass" if marks_obtained >= (0.75 * total_marks) else "Fail"


        Result.objects.create(
            student=student,
            marks_obtained=marks_obtained,
            total_marks=total_marks,
            result=result_status
        )


        # clear exam session only
        request.session.pop("question_ids", None)
        request.session.pop("start_time", None)


        return render(request,"login.html",{
            "student":student,
            "marks":marks_obtained,
            "total":total_marks,
            "result":result_status
        })

    return redirect("testpage")












def StudentRegistation(request):
    if request.method == "POST":
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("/")
    else:
        form = StudentForm()

    return render(request, "registation.html", {"form": form})




def StudentRegisterData(request):
    data=Student.objects.prefetch_related('results').all()
    return render(request,'register.html',{'data':data})


def StudentDelete(request, student_email):
    student = Student.objects.get(student_email=student_email)
    student.delete()
    return redirect("/")






@csrf_exempt
def Student_Result_Update(request, student_email):
    try:
        email = unquote(student_email)

        if request.method != "POST":
            return JsonResponse({"error": "Invalid method"}, status=405)

        data = json.loads(request.body)

        # 🔒 SAFE GET
        try:
            student = Student.objects.get(student_email=email)
        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)

        # 🔄 DATE CONVERSION (VERY IMPORTANT)
        student.student_dob = datetime.strptime(
            data["student_dob"], "%d-%m-%Y"
        ).date()

        student.exam_date = datetime.strptime(
            data["exam_date"], "%d-%m-%Y"
        ).date()

        # 🔄 BOOLEAN CONVERSION
        student.is_active = str(data["is_active"]).lower() == "true"

        # 🔄 OTHER FIELDS
        student.student_name = data["student_name"]
        student.student_email = data["student_email"]
        student.student_id = data["student_id"]
        student.student_password = data["student_password"]

        student.save()

        # 🔄 RESULT TABLE UPDATE
        Result.objects.update_or_create(
            student=student,
            defaults={
                "marks_obtained": int(data["marks_obtained"]),
                "total_marks": int(data["total_marks"]),
                "result": data["result"],
            }
        )

        return JsonResponse({"status": "success"})

    except Exception as e:
        print("UPDATE ERROR:", e)  # 👈 shows exact error in terminal
        return JsonResponse({"error": str(e)}, status=500)
