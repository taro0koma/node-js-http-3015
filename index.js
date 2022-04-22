'use strict';
const http = require('http');
// const fs = require('fs');
const pug = require('pug');
const server = http
    .createServer((req, res) => {
        const now = new Date();
        console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        switch (req.method) {
            case 'GET':
                /**
                 * アクセス者の打ち込んだURLに合わせて表示内容を分岐　動的処理
                 * pug をhtml化、ストリームでresに書き込む
                 * pug.renderFileでは第２引数処理を指定、Pugから取り込んだ変数部分にJSON形式の代入を行う
                 */
                if (req.url === '/enquetes/yaki-shabu') {
                    res.write(pug.renderFile('./form.pug', {
                        path: req.url,
                        firstItem: '焼き肉',
                        secondItem: 'しゃぶしゃぶ'
                    }));
                } else if (req.url = './enquetes/rice-bread') {
                    res.write(pug.renderFile('./form.pug', {
                        path: req.url,
                        firstItem: 'ごはん',
                        secondItem: 'パン'
                    }));
                }
                res.end(); // pipeしない場合はendが必要
                break;
            case 'POST':
                let rawData = '';
                req
                    .on('data', chunk => {
                        rawData += chunk;
                    })
                    .on('end', () => {
                        const answer = new URLSearchParams(rawData);
                        // const body = `${answer.get('name')}さんは${answer.get('yaki-shabu')}に投票しました`;
                        const body = `${answer.get('name')} さんは ${answer.get('favorite')} に投票しました！`
                        console.info(`[${now}] ${body}`);
                        res.write(`<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`);
                        res.end();
                    });
                break;
            default:
                break;
        }
    })
    .on('error', e => {
        console.error(`[${new Date()}] Server Error`, e);
    })
    .on('clientError', e => {
        console.error(`[${new Date()}] Client Error`, e);
    });
const port = 8000;
server.listen(port, () => {
    console.info(`[${new Date()}] Listening on ${port}`);
});