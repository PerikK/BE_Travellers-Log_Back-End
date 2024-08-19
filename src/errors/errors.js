class MissingFieldsError extends Error {}

class ExistingDataError extends Error {}

class DataNotFoundError extends Error {}

class IncorrectFieldTypeError extends Error {}

class InvalidCredentialsError extends Error {}

export {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
	IncorrectFieldTypeError,
	InvalidCredentialsError,
}
