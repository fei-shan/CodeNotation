from django.shortcuts import render
from django.http import JsonResponse
from app.models import AnnotationLog, Question


# question_list = [
#     {"idx": 0, "get_absolute_url": "", "content": "test"},
#     {"idx": 0, "get_absolute_url": "", "content": "test"},
# {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# # {"idx": 0, "get_absolute_url": "", "content": "test"},
# ]

user = {"username": "testuser"}
course = {"code": "CS1"}

# Create your views here.
def app_home(request):
    question_list = Question.objects.all().order_by('idx')[1:]
    return render(request,
                  "app/home.html",
                  {"question_list": question_list,
                   "user": user,
                   "course": course}
                  )


def app_question(request, idx):
    question = Question.objects.get(idx=idx)
    return render(request,
                  "app/app.html",
                  {"question": question})


def app_annotate(request):
    is_ajax = request.headers.get("x-requested-with") == "XMLHttpRequest"
    if not request.session.session_key:
        request.session.save()
    if is_ajax and request.method == "POST":
        try:
            log = AnnotationLog(
                session=request.session.session_key,
                question=request.POST.get("question"),
                annotation=request.POST.get("annotation"),
                selection=request.POST.get("selection"),
                code=request.POST.get("code"),
            )
            log.save()

            return JsonResponse({'success': 'success'}, status=200)
        except AnnotationLog.DoesNotExist:
            return JsonResponse({'error': 'Log not found'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)