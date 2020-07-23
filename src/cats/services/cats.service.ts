import { Injectable, Scope, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { Cat } from '../interfaces/cat.interceptor'

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  private readonly cats: Cat[] = []

  constructor(@Inject(CONTEXT) private context) { }

  create(cat: Cat): void {
    this.cats.push(cat)
  }

  findAll(): Cat[] {
    return this.cats
  }
}
