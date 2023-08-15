const testObj = {

}


const record = {
    id: 'recL1cMr8qR0ICgDh',
    createdTime: '2023-08-14T11:14:00.000Z',
    fields: {
        Title: '’Ene’io Botanical Garden & Visitor Center',
        Region: ['Oceania', 'Polynesia'],
        City: 'Field 19',
        'Coordinates (lat, lng)': '-18.6399949, -173.9121887',
        Tags: ['Garden'],
        'State / AAL1': 'Field 4',
        Country: 'Tonga'
    }
}

const [lat, lng] =  record.fields["Coordinates (lat, lng)"].split(",").map(parseFloat)

