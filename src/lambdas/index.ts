export const handler = async (event: any) => {
    console.log('Entered')
    console.log(event)
    return {
        statusCode: 200,
        body: {
            message: 'Test Done'
        }
    }
}