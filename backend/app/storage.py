# backend/app/storage.py
from typing import Dict
from .models import UploadRecord
from threading import Lock

_store: Dict[str, UploadRecord] = {}
_store_lock = Lock()

def save_record(record: UploadRecord):
    with _store_lock:
        _store[record.id] = record
    return record

def get_record(record_id: str):
    return _store.get(record_id)

def list_records():
    return list(_store.values())

def update_record(record_id: str, **kwargs):
    with _store_lock:
        r = _store.get(record_id)
        if not r:
            return None
        for k,v in kwargs.items():
            setattr(r, k, v)
        _store[record_id] = r
    return r

def delete_record(record_id: str):
    with _store_lock:
        return _store.pop(record_id, None)
