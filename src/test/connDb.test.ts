import getDb from "../connections/connDb";

test('connect to db from local', async () => {
    const res = await getDb();
    expect(res!==undefined&&res!==null).toBe(true);
});