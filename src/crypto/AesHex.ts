import { sha256 } from "ethers"
import * as forge from 'node-forge';
import { TypeUtil, Uint8Util } from "debeem-utils";

/**
 * 	@class
 */
export class AesHex
{
	/**
	 *	@param text		{string}
	 *	@param password		{string}
	 *	@returns {string}
	 */
	static encryptAES( text : string, password : string ) : string
	{
		try
		{
			const aesKey = this.calcAesKey( password );
			const 