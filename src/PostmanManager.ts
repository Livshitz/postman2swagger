import { libx } from 'libx.js/build/bundles/node.essentials';
import Request from 'libx.js/build/modules/Request';

export class PostmanManager {
    constructor(private postmanApiKey: string) {
        this.api = new Request('https://api.getpostman.com/collections/');
    }
    private api: Request;

    public async getCollection(collectionId: string): Promise<string> {
        let dl = await this.downloadCollection(collectionId);
        dl = this.cleanupCollection(dl);
        return JSON.stringify(dl);
    }

    private async downloadViaCurl(url: string) {
        let ret = libx.node.exec(`curl -sb --location --request GET "${url}"`, true, true);
        let obj = JSON.parse(ret + '}');
        obj = obj.collection;
        return ret;
    }

    private async downloadCollection(collectionId: string) {
        return (await this.api.get(`${collectionId}?apikey=${this.postmanApiKey}`))?.data;

        // const content = await this.download(`https://api.getpostman.com/collections/${collectionId}?apikey=${this.postmanApiKey}`);
        // return content;
    }

    private cleanupCollection(content: string | any) {
        let obj = content.collection;

        // obj.item = (obj.item as any[]).filter((x) => x.item?.length != 0);
        obj = this.cleanupCollection_removeEmpty(obj);

        return obj;
    }

    private cleanupCollection_removeEmpty(obj: any) {
        if (obj.item?.length == 0) return obj;

        for (let item of obj.item) {
            if (item.item != null) item = this.cleanupCollection_removeEmpty(item);
            if (item.request != null && item.request.url == null) obj.item.remove(item);
        }

        return obj;
    }
}
