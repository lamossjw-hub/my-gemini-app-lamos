import streamlit as st
import google.generativeai as genai
from PIL import Image

st.set_page_config(page_title="Gemini Image Editor", layout="wide")
st.title("🎨 Gemini Image Editor - Bản chính chủ của bà")

# Thanh bên để nhập Key
with st.sidebar:
    api_key = st.text_input("Dán Gemini API Key vào đây:", type="password")
    st.info("Lấy Key tại: aistudio.google.com")

col1, col2, col3 = st.columns([2, 1, 1])
with col1:
    ori_a = st.file_uploader("Ảnh gốc (Ori A)", type=['png', 'jpg', 'jpeg'])
with col2:
    ref_a = st.file_uploader("Ảnh mẫu 1 (Ref a)", type=['png', 'jpg', 'jpeg'])
with col3:
    ref_b = st.file_uploader("Ảnh mẫu 2 (Ref b)", type=['png', 'jpg', 'jpeg'])

prompt = st.text_area("Mô tả yêu cầu của bà:", placeholder="Ví dụ: Giữ nguyên form cái túi ở Ori A, thay nền sang trọng...")

if st.button("Magic Upgrade ✨"):
    if not api_key:
        st.error("Bà quên nhập API Key kìa!")
    elif not ori_a:
        st.error("Bà chưa chọn ảnh gốc kìa!")
    else:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Lệnh ép AI giữ form sản phẩm
        final_prompt = f"Keep the exact product shape and details from the first image. Change only the environment based on instructions: {prompt}"
        
        img = Image.open(ori_a)
        response = model.generate_content([final_prompt, img])
        st.markdown("### Kết quả gợi ý từ AI:")
        st.write(response.text)
        st.success("Bà copy ý tưởng này hoặc dùng nó để render tiếp nhé!")
