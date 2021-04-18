class Game {

    constructor(config = {}) {
        this.phaserConfig = {
            type: Phaser.AUTO,
            parent: config.id ? config.id : "game",
            width: config.width ? config.width : 800,
            height: config.height ? config.height : 600,
            scene: {
                key: "default",
                init: this.initScene,
                create: this.createScene,
                update: this.updateScene
            }
        };
        this.client = stitch.Stitch.initializeDefaultAppClient(config.realmAppId);
        this.database = this.client.getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas").db(config.databaseName);
        this.collection = this.database.collection(config.collectionName);
    }

    async initScene(data) {
        this.collection = data.collection;
        this.authId = data.authId;
        this.gameId = data.gameId;
        this.ownerId = data.ownerId;
        this.strokes = data.strokes;
        this.isDrawing = false;
    }
    async createScene() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, 0x04d9ff);
        this.strokes.forEach(stroke => {
            this.path = new Phaser.Curves.Path();
            this.path.fromJSON(stroke);
            this.path.draw(this.graphics);
        });
        const stream = await this.collection.watch({ "fullDocument._id": this.gameId });
        stream.onNext(event => {
            let updatedFields = event.updateDescription.updatedFields;
            if(updatedFields.hasOwnProperty("strokes")) {
                updatedFields = [updatedFields.strokes["0"]];
            }
            for(let strokeNumber in updatedFields) {
                let changeStreamPath = new Phaser.Curves.Path();
                changeStreamPath.fromJSON(updatedFields[strokeNumber]);
                changeStreamPath.draw(this.graphics);
            }
        });
    }
    updateScene() {
        // if(this.authId == this.ownerId) {
            if(!this.input.activePointer.isDown && this.isDrawing) {
                this.collection.updateOne(
                    {
                        "_id": this.gameId
                    },
                    {
                        "$push": {
                            "strokes": this.path.toJSON()
                        }
                    }
                ).then(result => console.log(result));
                this.isDrawing = false;
            } else if(this.input.activePointer.isDown) {
                if(!this.isDrawing) {
                    this.path = new Phaser.Curves.Path(this.input.activePointer.position.x - 2, this.input.activePointer.position.y - 2);
                    this.isDrawing = true;
                } else {
                    this.path.lineTo(this.input.activePointer.position.x - 2, this.input.activePointer.position.y - 2);
                }
                this.path.draw(this.graphics);
            }
        // }
    }

    async clearScene() {
        db.collection.update({}, { $set : {'strokes':[] }}, {multi:true} )
    }

    async authenticate() {
        return this.client.auth.loginWithCredential(new stitch.AnonymousCredential());
    }
    async joinOrCreateGame(id) {
        try {
            let auth = await game.authenticate();
            let result = await game.joinGame(id, auth.id);
            if (result == null) {
                result = await game.createGame(id, auth.id);
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }
    async joinGame(id, authId) {
        try {
            let result = await this.collection.findOne({ "_id": id });
            if(result != null) {
                this.game = new Phaser.Game(this.phaserConfig);
                this.game.scene.start("default", {
                    "gameId": id,
                    "collection": this.collection,
                    "authId": authId,
                    "ownerId": result.owner_id,
                    "strokes": result.strokes
                });
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }
    async createGame(id, authId) {
        try {
            let game = await this.collection.insertOne({
                "_id": id,
                "owner_id": authId,
                "strokes": []
            });
            this.game = new Phaser.Game(this.phaserConfig);
            this.game.scene.start("default", {
                "gameId": id,
                "collection": this.collection,
                "authId": authId,
                "ownerId": authId,
                "strokes": []
            });
            return { "gameId": id, "authId": authId, "owner_id": authId };
        } catch (e) {
            console.error(e);
        }
    }

}