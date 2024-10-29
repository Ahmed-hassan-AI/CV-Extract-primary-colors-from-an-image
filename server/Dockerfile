FROM  python:3.11.3

WORKDIR /app 

COPY requirements.txt .

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt


COPY . .

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "server:app", "--host", "127.0.0.1", "--port", "8000"]