#!/usr/bin/env python3
"""
سكريبت ضغط الصور - تلقائي لجميع صور البطاقات والقلوب
يضغط الصور من 5-10 MB إلى 200-300 KB ✨
"""

from PIL import Image
import os
from pathlib import Path

# المجلدات
FOLDERS = {
    "Cards_Photos": "📇 صور البطاقات",
    "Heart_Photos": "❤️ صور القلوب"
}

# الإعدادات
QUALITY = 75  # جودة الضغط (1-100) - 75 أفضل توازن
MAX_WIDTH = 1200  # أقصى عرض للصورة
MAX_HEIGHT = 1200  # أقصى ارتفاع

def get_file_size_mb(filepath):
    """حساب حجم الملف بـ MB"""
    return os.path.getsize(filepath) / (1024 * 1024)

def compress_image(input_path, output_path, quality=QUALITY):
    """ضغط صورة واحدة""" 
    try:
        # فتح الصورة
        img = Image.open(input_path)
        
        # تحويل RGBA إلى RGB إذا لزم (بعض الصور PNG)
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # تقليل الحجم إذا كانت أكبر
        img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.LANCZOS)
        
        # حفظ مع ضغط
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        return True
    except Exception as e:
        print(f"❌ خطأ في {input_path}: {e}")
        return False

def process_folder(folder_name, folder_label):
    """معالجة مجلد كامل"""
    folder_path = Path(folder_name)
    
    if not folder_path.exists():
        print(f"\n⚠️ المجلد '{folder_name}' غير موجود!")
        return 0, 0
    
    print(f"\n{'='*60}")
    print(f"🔄 جاري المعالجة: {folder_label}")
    print(f"{'='*60}")
    
    # البحث عن جميع الصور
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp')
    image_files = [f for f in folder_path.iterdir() 
                   if f.suffix.lower() in image_extensions]
    
    if not image_files:
        print(f"⚠️ لا توجد صور في المجلد!")
        return 0, 0
    
    print(f"📷 عدد الصور: {len(image_files)}")
    
    total_before = 0
    total_after = 0
    success_count = 0
    
    for idx, image_path in enumerate(image_files, 1):
        # حساب الحجم قبل
        size_before = get_file_size_mb(image_path)
        total_before += size_before
        
        # ضغط الصورة
        print(f"\n[{idx}/{len(image_files)}] 📸 {image_path.name}")
        print(f"   الحجم قبل: {size_before:.2f} MB", end=" → ")
        
        if compress_image(str(image_path), str(image_path)):
            # حساب الحجم بعد
            size_after = get_file_size_mb(image_path)
            total_after += size_after
            
            percentage = ((size_before - size_after) / size_before * 100)
            print(f"✅ {size_after:.2f} MB (توفير: {percentage:.1f}%)")
            success_count += 1
        else:
            total_after += size_before
    
    print(f"\n{'='*60}")
    print(f"📊 النتائج النهائية:")
    print(f"   ✅ عدد الصور المضغوطة: {success_count}/{len(image_files)}")
    print(f"   📉 الحجم الكلي قبل: {total_before:.2f} MB")
    print(f"   📉 الحجم الكلي بعد: {total_after:.2f} MB")
    print(f"   💾 التوفير: {total_before - total_after:.2f} MB ({(1-total_after/total_before)*100:.1f}%)")
    print(f"{'='*60}")
    
    return success_count, len(image_files)

def main():
    """الدالة الرئيسية"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "🎈 سكريبت ضغط صور عيد الميلاد الذكي".center(58) + "║")
    print("║" + "✨ سيجعل الموقع أسرع 30x 😍".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")
    
    total_compressed = 0
    total_files = 0
    
    # معالجة كل مجلد
    for folder_name, folder_label in FOLDERS.items():
        compressed, total = process_folder(folder_name, folder_label)
        total_compressed += compressed
        total_files += total
    
    # الملخص النهائي
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + f"✅ تم ضغط {total_compressed}/{total_files} صورة بنجاح!".ljust(58) + "║")
    print("║" + " "*58 + "║")
    print("║" + "🚀 الموقع جاهز للرفع على GitHub Pages".ljust(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝\n")
    
    if total_compressed == total_files:
        print("🎉 رائع! جميع الصور تمت معالجتها بنجاح!")
    else:
        print(f"⚠️ تحذير: {total_files - total_compressed} صورة لم تُضغط بنجاح")

if __name__ == "__main__":
    main()
