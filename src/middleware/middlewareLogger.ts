import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Estas ejecutando el metodo ${req.method} en la ${req.baseUrl}`,
    );
    next();
  }
}

export const LoggerGlobal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1;
  const año = fechaActual.getFullYear();
  const horas = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();
  const segundos = fechaActual.getSeconds();

  const fechaEjecucion = `${dia}/${mes}/${año}`;
  const horaActual = `${horas}:${minutos}:${segundos}`;

  console.log(
    `Request: ${req.method}, Url: ${req.url}, Date: ${fechaEjecucion}, Time: ${horaActual}`,
  );
  next();
};
