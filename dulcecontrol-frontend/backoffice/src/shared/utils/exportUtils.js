import { utils, writeFile } from 'xlsx';

const sanitizeSheetName = (name) => {
  if (!name) {
    return 'Sheet1';
  }
  const trimmed = name.toString().substring(0, 31);
  return trimmed.replace(/[\\/?*\[\]]/g, '-') || 'Sheet1';
};

const ensureXlsxExtension = (fileName) => {
  if (!fileName) {
    return 'export.xlsx';
  }
  return fileName.toLowerCase().endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
};

const mapDataWithColumns = (data = [], columns = []) => {
  if (!Array.isArray(data)) {
    return [];
  }
  if (!Array.isArray(columns) || columns.length === 0) {
    return data;
  }
  return data.map((item) => {
    return columns.reduce((acc, column) => {
      const value = typeof column.render === 'function'
        ? column.render(item[column.dataIndex], item)
        : item[column.dataIndex];
      acc[column.label] = value ?? '';
      return acc;
    }, {});
  });
};

export const exportToXlsx = ({ fileName, sheets }) => {
  if (!Array.isArray(sheets) || sheets.length === 0) {
    throw new Error('No hay hojas para exportar');
  }

  const workbook = utils.book_new();

  sheets.forEach((sheet) => {
    const safeName = sanitizeSheetName(sheet?.name);
    const rows = mapDataWithColumns(sheet?.data, sheet?.columns);
    const worksheet = utils.json_to_sheet(rows);
    if (Array.isArray(sheet?.columnWidths) && sheet.columnWidths.length > 0) {
      worksheet['!cols'] = sheet.columnWidths.map((width) => ({ wch: width }));
    }
    utils.book_append_sheet(workbook, worksheet, safeName);
  });

  const safeFileName = ensureXlsxExtension(fileName);
  writeFile(workbook, safeFileName, { compression: true });
};

export default exportToXlsx;
