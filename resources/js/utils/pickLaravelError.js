export function pickLaravelError(err){
  const data = err?.data;
  if (data && data.errors && typeof data.errors === 'object'){
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return data?.message || err?.message || 'Error inesperado';
}
