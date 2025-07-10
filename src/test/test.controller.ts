import { Controller, Get, Param } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('/')
  getTest() {
    return { message: 'Test endpoint is working!' };
  }
  @Get(':name')
  getTestWithName(@Param('name') name: string) {
    return { message: `Hello, ${name}!` };
  }
}
