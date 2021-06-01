export const handler = async (event: any) => {
    console.log('Handling Error', event)
    throw new Error(JSON.stringify({
        statusCode: 400,
        body: {
            message: 'Error Handled'
        }
    }));
}