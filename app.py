import streamlit as st
import google.generativeai as genai
from PIL import Image
import requests
import io

# Cấu hình giao diện Dark Mode cực gắt
st.set_page_config(page_title="Gemini Image Editor", layout="wide")

st.markdown("""
    <style>
    [data-testid="stAppViewContainer"] { background-color: #000000; color: white; }
    .stFileUploader { border: 1px solid #333; background: #111; border-radius: 10px; }
    .stButton>button { background-color: white; color: black; border-radius: 5px; width: 100%; font-weight: bold; height: 50px; }
    .stTextArea textarea { background-color: #111; color: white; border: 1px solid #333; }
    h3 { font-size: 14px !important; color: #888; text-transform: uppercase; }
    </style>
    """, unsafe_allow_html=True)

# Giao diện chính chia 2 cột như ảnh mẫu
col_display, col_control = st.columns([3, 1], gap="large")

with col_display:
    st.write("### ORIGINAL IMAGE")
    ori_file = st.file_uploader("Upload Ori A", type=['png','jpg','jpeg'], label_visibility="collapsed")
    if ori_file:
        st.image(ori_file, use_container_width=True)
    
    st.write("---")
    st.write("### REFERENCE")
    r1, r2 = st.columns(2)
    with r1:
        ref_a = st.file_uploader("Upload Ref A", type=['png','jpg','jpeg'], key="a")
    with r2:
        ref_b = st.file_uploader("Upload Ref B", type=['png','jpg','jpeg'], key="b")

with col_control:
    st.write("### CONTROL PANEL")
    api_key = st.text_input("Gemini API Key", type="password")
    prompt = st.text_area("PROMPT", placeholder="Ví dụ: Keep the bottle shape, change background to luxury marble...", height=200)
    
    if st.button("RUN UPGRADE"):
        if not api_key or not ori_file:
            st.error("Thiếu Key hoặc ảnh bà ơi!")
        else:
            with st.spinner("Đang 'vẽ' lại ảnh cho bà..."):
                # BƯỚC 1: Dùng Gemini để phân tích và giữ form
                genai.configure(api_key=api_key)
                gemini = genai.GenerativeModel('gemini-1.5-flash')
                
                # Ép Gemini tạo ra 1 câu mô tả cực chi tiết để vẽ ảnh
                instruction = f"Analyze the product in this image. Create a high-quality prompt for an image generator. The product MUST stay exactly the same shape. Instruction: {prompt}"
                img_pil = Image.open(ori_file)
                response = gemini.generate_content([instruction, img_pil])
                
                # BƯỚC 2: Dùng API vẽ ảnh miễn phí (Pollinations) để tạo kết quả
                ai_prompt = response.text.replace("\n", " ")
                image_url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(ai_prompt)}?width=1024&height=1024&nologo=true"
                
                st.write("### RESULT")
                st.image(image_url, caption="Ảnh đã được AI vẽ lại (Giữ form)")
                st.success("Xong rồi nè!")
