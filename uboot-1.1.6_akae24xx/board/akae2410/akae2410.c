/*
 * (C) 2009 by AKAEDU(www.akaedu.org). 
 * Author: weiqin <qinwei1998@hotmail.com>
 * 
 * based on existing S3C2410 startup code in u-boot and patch from OpenMoko
 *
 * (C) 2006 by OpenMoko, Inc.
 * Author: Harald Welte <laforge@openmoko.org>
 *
 * based on existing S3C2410 startup code in u-boot:
 *
 * (C) Copyright 2002
 * Sysgo Real-Time Solutions, GmbH <www.elinos.com>
 * Marius Groeger <mgroeger@sysgo.de>
 *
 * (C) Copyright 2002
 * David Mueller, ELSOFT AG, <d.mueller@elsoft.ch>
 *
 * See file CREDITS for list of people who contributed to this
 * project.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston,
 * MA 02111-1307 USA
 */

#include <common.h>
#include <video_fb.h>
#include <usbdcore.h>
#include <s3c2410.h>

DECLARE_GLOBAL_DATA_PTR;

#if 1
//#define M_MDIV	0xA1		/* Fout = 202.8MHz */
//#define M_PDIV	0x3
//#define M_SDIV	0x1
#define M_MDIV	0x90		/* Fout = 202.8MHz */
#define M_PDIV	0x7
#define M_SDIV	0x0
#else
#define M_MDIV	0x5c		/* Fout = 150.0MHz */
#define M_PDIV	0x4
#define M_SDIV	0x0
#endif

#if 1
#define U_M_MDIV	0x78
#define U_M_PDIV	0x2
#define U_M_SDIV	0x3
#else
#define U_M_MDIV	0x48
#define U_M_PDIV	0x3
#define U_M_SDIV	0x2
#endif

static inline void delay (unsigned long loops)
{
	__asm__ volatile ("1:\n"
	  "subs %0, %1, #1\n"
	  "bne 1b":"=r" (loops):"0" (loops));
}

/*
 * Miscellaneous platform dependent initialisations
 */

int board_init (void)
{
	S3C24X0_CLOCK_POWER * const clk_power = S3C24X0_GetBase_CLOCK_POWER();
	S3C24X0_GPIO * const gpio = S3C24X0_GetBase_GPIO();
	S3C24X0_MEMCTL * const memctl = S3C24X0_GetBase_MEMCTL();
	unsigned long bus_conf;

	/* to reduce PLL lock time, adjust the LOCKTIME register */
	clk_power->LOCKTIME = 0xFFFFFF;

	/* configure MPLL */
	clk_power->MPLLCON = ((M_MDIV << 12) + (M_PDIV << 4) + M_SDIV);

	/* some delay between MPLL and UPLL */
	delay (4000);

	/* configure UPLL */
	clk_power->UPLLCON = ((U_M_MDIV << 12) + (U_M_PDIV << 4) + U_M_SDIV);

	/* some delay between MPLL and UPLL */
	delay (8000);

	/* set up the I/O ports */
	gpio->GPACON = 0x007FFFFF;
	gpio->GPBCON = 0x00044555;
	gpio->GPBUP = 0x000007FF;
	gpio->GPCCON = 0xAAAAAAAA;
	gpio->GPCUP = 0x0000FFFF;
	gpio->GPDCON = 0xAAAAAAAA;
	gpio->GPDUP = 0x0000FFFF;
	gpio->GPECON = 0xAAAAAAAA;
	gpio->GPEUP = 0x0000FFFF;
	gpio->GPFCON = 0x000055AA;
	gpio->GPFUP = 0x000000FF;
	gpio->GPGCON = 0xFF95FFBA;
	//gpio->GPGUP = 0x0000FFFF;
	gpio->GPGUP = 0x0000AFEF;
	gpio->GPHCON = 0x0028FAAA;
	gpio->GPHUP = 0x000007FF;

	/*configure for cs8900 chip IO*/
	bus_conf = memctl->BWSCON;
	memctl->BWSCON = (bus_conf & ~0x0000F000) | 0x0000d000;

	/* arch number of AKAE2410-Board */
	gd->bd->bi_arch_number = MACH_TYPE_AKAE2410;

	/* adress of boot parameters */
	gd->bd->bi_boot_params = 0x30000100;

	icache_enable();
	dcache_enable();

	return 0;
}

#if defined(CONFIG_USB_DEVICE)
void udc_ctrl(enum usbd_event event, int param)
{
}
#endif

void board_video_init(GraphicDevice *pGD)
{
	S3C24X0_LCD * const lcd = S3C24X0_GetBase_LCD();

	/* FIXME: select LCM type by env variable */

	/* Configuration for GTA01 LCM on QT2410 */
	lcd->LCDCON1 = 0x00000178; /* CLKVAL=1, BPPMODE=16bpp, TFT, ENVID=0 */

	lcd->LCDCON2 = 0x019fc3c1;
	lcd->LCDCON3 = 0x0039df67;
	lcd->LCDCON4 = 0x00000007;
	lcd->LCDCON5 = 0x0001cf09;
	lcd->LPCSEL  = 0x00000000;
}

int dram_init (void)
{
	gd->bd->bi_dram[0].start = PHYS_SDRAM_1;
	gd->bd->bi_dram[0].size = PHYS_SDRAM_1_SIZE;

	return 0;
}
