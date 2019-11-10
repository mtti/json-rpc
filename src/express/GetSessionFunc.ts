import express from 'express';

export type GetSessionFunc<Sess> = (req: express.Request) => Promise<Sess>;
