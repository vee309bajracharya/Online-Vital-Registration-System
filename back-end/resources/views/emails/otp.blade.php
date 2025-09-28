<x-mail::message>
# Phone Verification OTP Code

Your OTP code for verifying phone number **{{$phone}}** is:
 **{{ $otp }}**

 This code expires in **5 minutes**. If you did not request this code, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
