export default function clone<T>(obj: T): T {
  const str = JSON.stringify(obj);
  const cloned = JSON.parse(str) as T;
  return cloned;
}
