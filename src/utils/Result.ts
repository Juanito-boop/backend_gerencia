class Result<T, E = string> {
	public isSuccess: boolean;
	public isFailure: boolean;
	public error: E | null;
	private value: T | undefined;

	private constructor(isSuccess: boolean, error?: E, value?: T) {
		if (isSuccess && error) {
			throw new Error("A result cannot be successful and contain an error");
		}
		if (!isSuccess && !error) {
			throw new Error("A failing result needs to contain an error message");
		}

		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this.error = error || null;
		this.value = value || undefined;
	}

	public getValue(): T {
		if (!this.isSuccess) {
			throw new Error(
				"Can't get the value of an error result. Use 'errorValue' instead."
			);
		}
		return this.value as T;
	}

	public errorValue(): E {
		return this.error as E;
	}

	public static success<U>(value?: U): Result<U> {
		return new Result<U>(true, undefined, value);
	}

	public static fail<U, F>(error: F): Result<U, F> {
		return new Result<U, F>(false, error);
	}
}

export default Result;