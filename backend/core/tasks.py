from celery import shared_task
from .models import UploadedFile
from .services import process_csv
from .pdf_parser import process_pdf

@shared_task
def process_uploaded_file(file_id):
    print(f"✅ TASK RECEIVED file_id={file_id}")

    try:
        upload = UploadedFile.objects.get(id=file_id)
        file_path = upload.file.path

        if upload.file_type == "csv":
            process_csv(file_path, upload.company)
            print("✅ CSV processed successfully")

        elif upload.file_type == "pdf":
            process_pdf(file_path, upload.company)
            print("✅ PDF processed successfully")

        else:
            print(f"⚠️ Unsupported file_type: {upload.file_type}")

        print("✅ File processed successfully")
        return True

    except Exception as e:
        print("❌ Processing failed:", e)
        return False
