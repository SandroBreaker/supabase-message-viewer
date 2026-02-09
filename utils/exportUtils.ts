// utils/exportUtils.ts
export const downloadFile = (data: string, fileName: string, contentType: string) => {
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const jsonToCsv = (items: any[]) => {
  if (items.length === 0) return '';
  const replacer = (key: string, value: any) => (value === null ? '' : value);
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','), // header row
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    ),
  ].join('\r\n');
  return csv;
};
