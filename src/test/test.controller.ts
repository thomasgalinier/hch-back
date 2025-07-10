import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('/')
  getTest() {
    return { message: 'Test endpoint is working!' };
  }
  @Get('/test/:name')
  getTestWithName(name: string) {
    return { message: `Hello, ${name}!` };
  }
}
