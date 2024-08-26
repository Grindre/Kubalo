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
			const aesIv = this.calcAesIv( password );

			const textBytes = forge.util.createBuffer( text, 'utf8' );
			const cipher = forge.cipher.createCipher( 'AES-CBC', aesKey );
			cipher.start( { iv : aesIv } );
			cipher.update( forge.util.createBuffer( textBytes ) );
			cipher.finish();

			//	encrypted hex
			return cipher.output.toHex();
			//return ( forge.util.encode64( cipher.output.getBytes() ) );
		}
		catch ( err )
		{
			//console.error( `encryptAES`, err );
			return text;
		}
	}

	/**
	 *	@param encryptedHex	{string}
	 *	@param password		{string}
	 *	@returns {string}
	 */
	static decryptAES( encryptedHex : string, password : string ) : string
	{
		try
		{
			const aesKey = this.calcAesKey( password );
			const aesIv = this.calcAesIv( password );

			const byteArray = forge.util.hexToBytes( encryptedHex );
			const byteStringBuffer = forge.util.createBuffer(byteArray);
			const decipher 