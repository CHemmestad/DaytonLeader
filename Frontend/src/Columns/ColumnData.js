// useColumnData.js
import { useEffect, useState } from 'react';

export const ColumnData = (columnKey, authorName) => {
    const defaultColumn = {
        title: "Loading...",
        author: authorName,
        date: "Loading...",
        content: "Loading...",
    };

    const failedFetchColumn = {
        title: "Unable to retrieve title",
        author: authorName,
        date: "Unavailable",
        content: "We're sorry, this column could not be retrieved at this time.",
    };

    const [column, setColumn] = useState(defaultColumn);

    //   useEffect(() => {
    //     fetch(`http://0.0.0.0:8081/columns/${encodeURIComponent(columnKey)}`)
    //       .then((res) => res.ok ? res.json() : Promise.reject('Not found'))
    //       .then((data) => {
    //         setColumn((prev) => ({
    //           ...prev,
    //           title: data.title || prev.title,
    //           date: data.date
    //             ? new Date(data.date).toLocaleDateString('en-US', {
    //                 year: 'numeric',
    //                 month: 'long',
    //                 day: 'numeric',
    //               })
    //             : prev.date,
    //           content: data.content || prev.content,
    //         }));
    //       })
    //       .catch(() => {
    //         console.warn("Using fallback content (failed to fetch from DB)");
    //         setColumn(failedFetchColumn);
    //       });
    //   }, [columnKey]);

    useEffect(() => {
        // fetch(`http://0.0.0.0:8081/columns/${encodeURIComponent(columnKey)}`)
        fetch(`https://daytonleader.onrender.com/columns/${encodeURIComponent(columnKey)}`)
            .then(res => res.ok ? res.json() : Promise.reject('Not found'))
            .then(data => {
                // Simulate 2 second delay
                setColumn((prev) => ({
                    ...prev,
                    title: data.title || prev.title,
                    date: data.date
                        ? new Date(data.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : prev.date,
                    content: data.content || prev.content,
                }));
            })
            .catch(() => {
                setColumn(failedFetchColumn);
            });
    }, [columnKey]);


    return column;
};
