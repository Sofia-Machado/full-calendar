export const dragList = [
    {
        id: 1,
        title: 'Call Pedro',
        extendedProps: {
        category: 'Santé',
        mandatory: true,
        },
        
    },
    {
        id: 2,
        title: 'Call Oscar',
        extendedProps: {
        category: 'Vie',
        mandatory: false,
        },
    },
];

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const list = [
    {
        id: 1,
        title: 'Call Julia',
        extendedProps: {
            category: 'Santé',
            mandatory: true,
            resourceEditable: true,
        },
        start: todayStr + 'T12:00:00',
        end: todayStr + 'T13:00:00',
        backgroundColor: '#e3ab9a',
        borderColor: '#e3ab9a',
        editable: false
    },
    {
        id: 2,
        title: 'Call Sandra',
        extendedProps: {
            category: 'Vie',
            mandatory: false,
            resourceEditable: true,
        },
        start: todayStr + 'T14:00:00',
        end: todayStr + 'T14:15:00',
        backgroundColor: '#44936c',
        borderColor: '#44936c',
        editable: true,
    },
    {
        id: 3,
        title: 'Call Francisco',
        extendedProps: {
            category: 'Vie',
            mandatory: true,
            resourceEditable: true,
        },
        start: todayStr + 'T09:00:00',
        end: todayStr + 'T09:15:00',
        backgroundColor: '#44936c',
        borderColor: '#44936c',
        editable: false,
    },
    {
        id: 4,
        title: 'Call Zeca',
        extendedProps: {
            category: 'Vie',
            mandatory: true,
            resourceEditable: true,
        },
        start: todayStr + 'T10:00:00',
        end: todayStr + 'T10:15:00',
        backgroundColor: '#44936c',
        borderColor: '#44936c',
        editable: false,
    }
]