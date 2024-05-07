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
			const cipher = forge.cipher.createCipher( 'AES-CTR', forge.util.createBuffer( aesKey ) );
			cipher.start( { iv : iv } );
			cipher.update( textBytes );
			cipher.finish();
			const encrypted = cipher.output;
			return ( forge.util.encode64( encrypted.getBytes() ) );
		}
		catch ( err )
		{
			console.error( `encryptAES`, err );
			return text;
		}
	}

	/**
	 *	@param encryptedBase64	{string}
	 *	@param password		{string}
	 *	@returns {string}
	 */
	static decryptAES( encryptedBase64 : string, password : string ) : string
	{
		try
		{
			const aesKey : Uint8A