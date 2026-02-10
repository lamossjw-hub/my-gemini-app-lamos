import streamlit as st
import google.generativeai as genai
from PIL import Image

# Cấu hình trang rộng và tiêu đề
st.set_page_config(page_title="Gemini Image Editor", layout="wide")

# Phần CSS này để "ép" giao diện giống cái app bà thích
st.markdown("""
    <style>
    .upload-box {
        border: 2px dashed #4e4e4e;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        background-color: #1e1e1e;
        color: white;
    }
    .stButton>button {
        width: 100%;
        background-color: #ffffff;
        color: black;
        border-radius: 20px;
        font-weight: bold;
    }
    .stTextArea textarea {
        background-color: #1e1e1e;
        color: white;
        border: 1px solid #4e4e4e;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("Gemini Image Editor")

# Chia cột giống hệt ảnh mẫu
col_main, col_side = st.columns([3, 1])

with col_main:
    # Hàng trên cho Ori A
    st.subheader("Original Image")
    ori_a = st.file_uploader("Drop original image here (Ori A)", type=['png', 'jpg', 'jpeg'], label_visibility="collapsed")
    if ori_a:
        st.image(ori_a, caption="Original Image", use_container_width=True)
    else:
        st.markdown('<div class="upload-box">📁 <br> Drop original image here</div>', unsafe_allow_html=True)

    # Hàng dưới cho 2 ảnh Ref
    st.write("---")
    st.subheader("Reference Images")
    ref_col1, ref_col2 = st.columns(2)
    with ref_col1:
        ref_a = st.file_uploader("Ref a", type=['png', 'jpg', 'jpeg'])
    with ref_col2:
        ref_b = st.file_uploader("Ref b", type=['png', 'jpg', 'jpeg'])

with col_side:
    st.subheader("Control Panel")
    api_key = st.text_input("Enter Gemini API Key", type="password")
    
    prompt = st.text_area("Prompt", placeholder="Enter your instructions here...", height=200)
    
    if st.button("RUN UPGRADE"):
        if not api_key:
            st.warning("Please enter API Key!")
        elif not ori_a:
            st.warning("Please upload Ori A!")
        else:
            # Đoạn xử lý AI
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Chỉ thị giữ form sản phẩm
            final_prompt = f"TASK: Keep the exact shape and form of the product in Ori A. Re-imagine the background using Ref A and Ref B. Instruction: {prompt}"
            
            img = Image.open(ori_a)
            with st.spinner('AI is thinking...'):
                response = model.generate_content([final_prompt, img])
                st.success("Done!")
                st.write(response.text)
