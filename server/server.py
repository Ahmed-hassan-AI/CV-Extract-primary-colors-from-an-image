
from fastapi import FastAPI ,UploadFile ,File , HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from sklearn.cluster import  KMeans
import numpy as np
from PIL import Image
from collections import Counter
import io
app = FastAPI()

origins=['http://localhost:3000']

app.add_middleware(
      CORSMiddleware,
      allow_origins=origins,
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
)

@app.post('/getcolors')
async def Get_colors(image:UploadFile=File(...))-> dict:
      if image.content_type.startswith('image'):
            content= await image.read()
            # convert Image to By 
            image =Image.open(io.BytesIO(content))   
            # convert Image to RGB 
            rgb_image = image.convert("RGB")
            # Convert to Array
            image_array = np.array(rgb_image)
            # Reshape image Array 
            pixels=image_array.reshape(-1,3)
            num_colors = 6
            # cluster colors
            kmeans = KMeans(n_clusters=num_colors,random_state=42)
            kmeans.fit(pixels)
            colors = kmeans.cluster_centers_
            colors = colors.astype(int)
            labels = kmeans.labels_
            label_counts = Counter(labels)
            most_common_labels = label_counts.most_common(num_colors)
            most_common_colors = [colors[label] for label, count in most_common_labels]
            rgbLists=[rgb.tolist() for rgb in most_common_colors]
            return {"primary_color":rgbLists[1],"scondary_colors":rgbLists[1:]}
      else: 
         raise  HTTPException(detail='images only',status_code= 400)

