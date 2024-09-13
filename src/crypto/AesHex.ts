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
			const decipher = forge.cipher.createDecipher( 'AES-CBC', aesKey );
			decipher.start( { iv : aesIv } );
			decipher.update( byteStringBuffer );
			const result = decipher.finish(); // check 'result' for true/false

			return forge.util.decodeUtf8( decipher.output.data );
		}
		catch ( err )
		{
			//console.error( `decryptAES`, err );
			return encryptedHex;
		}
	}

	/**
	 *	@param password		{string}
	 *	@returns {string}
	 */
	static calcAesKey( password : string ) : string
	{
		if ( ! TypeUtil.isNotEmptyString( password ) )
		{
			throw new Error( `invalid password` );
		}

		const sha256String : string = sha256( Uint8Util.stringToUint8Array( password ) );
		return sha256String.slice( 0, 16 );
	}

	/**
	 *	@param password		{string}
	 *	@returns {Array<number>}
	 */
	static calcAesIv( password : string ) : Array<number>
	{
		if ( ! TypeUtil.isNotEmptyString( password ) )
		{
			throw new Error( `invalid password` );
		}

		const sha256String : string = sha256( Uint8Util.stringToUint8Array( password ) );
		const aesKey : Uint8Array = Uint8Util.hexToUInt8Array( sha256String );
		return Array.from( aesKey.slice( 0, 16 ) );
	}
}
