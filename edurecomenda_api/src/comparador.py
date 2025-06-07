import time
from copy import deepcopy
from .merge_sort import merge_sort

def comparar_algoritmos(lista, chave):
    copia1 = deepcopy(lista)
    copia2 = deepcopy(lista)

    t1 = time.time()
    merge_sort(copia1, chave)
    t2 = time.time()

    t3 = time.time()
    sorted(copia2, key=lambda x: x[chave], reverse=True)
    t4 = time.time()

    return {
        "Merge Sort (s)": round(t2 - t1, 6),
        "Sort Nativo (s)": round(t4 - t3, 6)
    }
