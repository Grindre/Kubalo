import { sha256 } from "ethers"
import * as forge from 'node-forge';
import { TypeUtil, Uint8Util } from "debeem-utils";

/**
 * 	@class
 */
export class AesBase64
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
			const aesKey : Uint8Array = this.getAesKeyByPassword( password );
			const iv : Array<number> = this.getAesIvByPassword( password );

			const textBytes = forge.util.createBuffer( text, 'utf8' );
			const cipher = forge.cipher.createCipher( 'AES-CTR', f