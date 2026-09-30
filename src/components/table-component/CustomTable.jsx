import { useMemo, useState } from "react";

const getSortValue = (row, column) => {
  if (typeof column.sortValue === "function") return column.sortValue(row);
  const key = column.sortAccessor || column.accessor;
  return key ? row[key] : undefined;
};

const compareValues = (a, b, type) => {
  const aEmpty = a === null || a === undefined || a === "";
  const bEmpty = b === null || b === undefined || b === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (type === "number") {
    // eslint-disable-next-line no-useless-escape
    const na = Number(String(a).replace(/[^0-9.\-]/g, ""));
    // eslint-disable-next-line no-useless-escape
    const nb = Number(String(b).replace(/[^0-9.\-]/g, ""));
    if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return na - nb;
  }

  if (type === "date") {
    const ta = new Date(a).getTime();
    const tb = new Date(b).getTime();
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return ta - tb;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const SortIcon = ({ direction }) => {
  const upActive = direction === "asc";
  const downActive = direction === "desc";
  return (
    <span className="inline-flex flex-col items-center justify-center ml-[0.6rem] leading-none">
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        className={`transition-opacity ${upActive ? "opacity-100" : "opacity-40"}`}
      >
        <path d="M5 0L10 6H0L5 0Z" fill="currentColor" />
      </svg>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        className={`mt-[2px] transition-opacity ${downActive ? "opacity-100" : "opacity-40"}`}
      >
        <path d="M5 6L0 0H10L5 6Z" fill="currentColor" />
      </svg>
    </span>
  );
};

const CustomTable = ({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  emptyMessage = "No data found",
  defaultSort = null,
}) => {
  const [sort, setSort] = useState(defaultSort);

  const sortedData = useMemo(() => {
    if (!sort || sort.index == null) return data;
    const column = columns[sort.index];
    if (!column || !column.sortable) return data;
    const copy = [...data];
    copy.sort((r1, r2) =>
      compareValues(getSortValue(r1, column), getSortValue(r2, column), column.sortType),
    );
    return sort.dir === "desc" ? copy.reverse() : copy;
  }, [data, sort, columns]);

  const handleHeaderClick = (index) => {
    const column = columns[index];
    if (!column?.sortable) return;
    setSort((prev) => {
      if (!prev || prev.index !== index) return { index, dir: "asc" };
      if (prev.dir === "asc") return { index, dir: "desc" };
      return null;
    });
  };

  return (
    <table className="w-full border-separate border-spacing-y-2 text-sm text-gray-700">
      <thead className="sticky top-0 z-10 ">
        <tr>
          {columns.map((column, colIndex) => {
            const isSorted = sort && sort.index === colIndex;
            const direction = isSorted ? sort.dir : null;
            const headerContent = column.sortable ? (
              <button
                type="button"
                onClick={() => handleHeaderClick(colIndex)}
                className="inline-flex items-center gap-[0.4rem] text-left select-none cursor-pointer hover:opacity-80"
                aria-sort={
                  direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"
                }
              >
                <span style={{ whiteSpace: "nowrap" }}>{column.header}</span>
                <SortIcon direction={direction} />
              </button>
            ) : (
              column.header
            );

            return (
              <th
                key={column.accessor || colIndex}
                className={`
                    px-4 py-3 text-left font-semibold bg-[#E0E0E0]
                    ${colIndex === 0 ? "rounded-l-[16px] pl-[4.3rem]" : ""}
                    ${colIndex === columns.length - 1 ? "rounded-r-[16px]" : ""}
                    ${column.headerClassName || ""}
                  `}
              >
                {headerContent}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="py-6 text-center rounded-lg bg-white">
              Loading...
            </td>
          </tr>
        ) : sortedData.length > 0 ? (
          sortedData.map((row, rowIndex) => (
            <tr key={row[keyField]}>
              {columns.map((column, colIndex) => (
                <td
                  key={column.accessor || colIndex}
                  className={`
                     pl-[2rem] pr-[4.3rem] py-[2rem] text-(--color-liteGray) text-left text-[1.6rem]
                      ${rowIndex % 2 === 1 ? "bg-(--tableBody)" : "bg-transparent"}
                      ${rowIndex % 2 === 1 && colIndex === 0 ? "rounded-l-[1.6rem]" : ""}
                      ${
                        rowIndex % 2 === 1 && colIndex === columns.length - 1
                          ? "rounded-r-[1.6rem]"
                          : ""
                      }
                      ${column.cellClassName || ""}
                    `}
                >
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="py-6 text-center text-[2.2rem] rounded-lg bg-white"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomTable;
