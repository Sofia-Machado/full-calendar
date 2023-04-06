const DraggableEvents = () => {
    let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
    const list = [
        {
            id: 1,
            title: 'Call Julia',
            category: 'Santé',
            mandatory: true,
            start: todayStr + 'T12:00:00',
            end: todayStr + 'T13:00:00'
        },
        {
            id: 2,
            title: 'Call Sandra',
            category: 'Vie',
            mandatory: false,
            start: todayStr + 'T14:00:00',
            end: todayStr + 'T14:15:00'
        }
    ]

    return ( 
        <ul>
            {list.map(item => {
                return <li key={item.id} className='draggable-item'>{item.title}</li>
            })}
        </ul>
     );
}
 
export default DraggableEvents;