from config import *
import pandas as pd
from sqlalchemy import create_engine


oracle_connection_string = 'oracle+cx_oracle://{username}:{password}@{hostname}:{port}/{sid}'

engine = create_engine(
    oracle_connection_string.format(
        username=user,
        password=password,
        hostname=host,
        port=port,
        sid=sid,
    )
)

data = pd.read_sql("SELECT * FROM Testing", engine)

print(data)