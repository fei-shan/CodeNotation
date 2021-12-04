from django.shortcuts import render
from django.http import JsonResponse
from app.models import AnnotationLog

# Create your views here.
def app_home(request):
    return render(request,
                  "app/app.html")


def app_logs_add(request):
    is_ajax = request.headers.get("x-requested-with") == "XMLHttpRequest"
    if not request.session.session_key:
        request.session.save()
    if is_ajax and request.method == "POST":
        try:
            log = AnnotationLog(
                session_id=request.session.session_key,
                question_id=request.POST.get("question"),
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