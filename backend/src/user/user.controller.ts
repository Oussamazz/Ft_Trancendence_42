import { BadRequestException, Body, Controller, Get, HttpException, NotFoundException, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/utils/Guards';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { SetEmailDto, setPasswordDto, setUsernameDto } from './user.dto';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllUser(@Res() res: Response) {
		res.redirect('user/profile');
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Req() req: any) {
		if (!req.user.id)
			throw new BadRequestException(req.user.id);
		return this.userService.getUserDataById(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/id/:userId')
	async getUserById(@Req() req: any, @Param('userId') userId: number) {
		const user = await this.userService.getUserById(req.user.id, +userId)
		if (!user) throw new NotFoundException("User not Found");
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/:username')
	async getUserByUsername(@Param('username') username: string) {
		if (!username)
			throw new BadRequestException('Missing username');
		return await this.userService.findUserByUsername(username);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/avatar/:id')
	async getAvatar(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.getAvataById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getStats/:id')
	async getStats(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		if (!req.user.id) throw new BadRequestException('Missing username');
		return this.userService.getStatsById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/setUsername')
	async setUsername(@Req() req: any, @Body() username: setUsernameDto) {
		if (!username) throw new BadRequestException("Invalid Username");
		await this.userService.setUsername(req.user.id, username.username);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/setEmail')
	async setEmail(@Req() req: any, @Body() emailDto: SetEmailDto) {
		if (!emailDto) throw new BadRequestException("Invalid Email");
		await this.userService.setEmail(req.user.id, emailDto.email);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/setPassword')
	async setPassword(@Req() req: any, @Body() password: setPasswordDto) {
		if (!password.password) throw new BadRequestException();
		await this.userService.setPassword(req.user.id, password.password);
	}


}
