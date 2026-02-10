import streamlit as st
import google.generativeai as genai
from PIL import Image

# Cấu hình giao diện rộng và tối
st.set_page_config(page_title="Gemini Image Editor", layout="wide", initial_sidebar_state="collapsed")

# --- PHẦN CSS "HÔ BIẾN" GIAO DIỆN ---
st.markdown("""
    <style>
    /* Nền tối toàn trang */
    [data-testid="stAppViewContainer"] {
        background-color: #0e1117;
        color: #ffffff;
    }
    
    /* Định dạng các ô Upload giống ảnh mẫu */
    .stFileUploader {
        background-color: #161b22;
        border: 1px dashed #30363d;
        border-radius: 8px;
        padding: 10px;
    }
    
    /* Ẩn bớt các dòng chữ thừa của Streamlit */
    [data-testid="stFileUploadDropzone"] div div {
        display: none;
    }
    [data-testid="stFileUploadDropzone"]::before {
        content: "Drop image here";
        color: #8b949e;
    }

    /* Nút RUN UPGRADE đen/trắng đúng kiểu */
    .stButton>button {
        width: 100%;
        background-color: #ffffff;
        color: #000000;
        border-radius: 4px;
        border: none;
        font-weight: 600;
        height: 45px;
    }
    
    /* Ô Text Area (Prompt) */
    .stTextArea textarea {
        background-color: #0d1117;
        border: 1px solid #30363d;
        color: #c9d1d9;
    }
    
    /* Tiêu đề các mục */
    h2, h3 {
        color: #f0f6fc;
        font-size: 1.2rem !important;
        font-weight: 400 !important;
    }
    </style>
    """, unsafe_allow_html=True)

# --- BỐ CỤC CHÍNH ---
st.title("Gemini Image Editor")

# Chia 2 cột lớn: Trái là Upload, Phải là Control Panel
col_left, col_right = st.columns([2.5, 1], gap="large")

with col_left:
    # Mục Ori A
    st.markdown("### Ori A")
    ori_file = st.file_uploader("ori_a", type=['png', 'jpg', 'jpeg'], key="ori", label_visibility="collapsed")
    if ori_file:
        st.image(ori_file, use_container_width=True)
    else:
        st.info("Chưa có ảnh Ori A")

    st.markdown("---")
    
    # Mục Reference (Chia 2 cột nhỏ)
    st.markdown("### Reference")
    ref_c1, ref_c2 = st.columns(2)
    with ref_c1:
        st.markdown("##### ref a")
        ref_a_file = st.file_uploader("ref_a", type=['png', 'jpg', 'jpeg'], key="refa", label_visibility="collapsed")
        if ref_a_file: st.image(ref_a_file)
        
    with ref_c2:
        st.markdown("##### ref b")
        ref_b_file = st.file_uploader("ref_b", type=['png', 'jpg', 'jpeg'], key="refb", label_visibility="collapsed")
        if ref_b_file: st.image(ref_b_file)

with col_right:
    st.markdown("### Control Panel")
    api_key = st.text_input("Gemini API Key", type="password", placeholder="Paste key here...")
    
    st.markdown("##### Prompt")
    prompt_text = st.text_area("prompt", placeholder="Describe how to edit and maintain the product shape...", height=150, label_visibility="collapsed")
    
    if st.button("RUN UPGRADE"):
        if not api_key or not ori_file:
            st.error("Thiếu Key hoặc ảnh gốc rồi bà!")
        else:
            with st.spinner("Đang xử lý..."):
                try:
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    
                    # Lệnh bí mật để giữ form sản phẩm
                    full_prompt = f"STRICT: Keep the exact shape/form of objects in the first image. Change only the style and background based on: {prompt_text}"
                    
                    img_input = Image.open(ori_file)
                    response = model.generate_content([full_prompt, img_input])
                    
                    st.markdown("---")
                    st.markdown("### Result Suggestion:")
                    st.write(response.text)
                except Exception as e:
                    st.error(f"Lỗi rồi: {e}")
